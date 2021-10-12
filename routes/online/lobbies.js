const express = require('express');
const router = express.Router();

const { User, Lobby } = require('../../models');
const { getLobbyAmount, checkMaxPlayers } = require('./checkplan')

const LAST_TIMESTAMP = "lastTimestamp";
const PLAYER_ID = "playerID";
const DISCONNECTED_TIME_MIL = 10000; 
/* If data is older than 10 seconds, then player disconnected */

router.post('/:paddedID/lobby/:lobbyNumber/player/:playerID', (req, res, next) => {
  
  if (!req.body) {
    res.status(401).send({
      'message': 'No JSON data.'
    });
    return;
  }
  
  var paddedID = parseInt(req.params.paddedID);
  var lobbyNumber = parseInt(req.params.lobbyNumber);
  var playerID = req.params.playerID;
  var realID = Math.floor(paddedID/parseInt(process.env.SECRET_ID_MULTIPLIER);
  /* The multiplier helps limit attackers from guessing IDs */
  
  User.findOne({ where: { id: realID } }).then(result => {

    if (!result) {
      res.status(401).send({
        'message': 'Organization ID not found.'
      });
      return;

    }

    const maxLobbies = getLobbyAmount(result.dataValues.plan);
    const maxPlayers = checkMaxPlayers(maxLobbies);
    
    if (lobbyNumber > maxLobbies) {
      res.status(401).send({
        'message': 'You can only have a maximum of ' + maxLobbies + ' lobbies.'
      });
      return;

    } else if (lobbyNumber < 0) {
      res.status(401).send({
        'message': 'Lobby ID cannot be negative.'
      });
      return;        

    }

    Lobby.findOne(
      { where: { org_id: realID, number: lobbyNumber } }
    ).then(lobbyResult => {
      if (!lobbyResult) { /* Lobby not found; create it */
        /*
         * Lobby IDs can start from 0 or 1.
         * This means that accounts actually get one extra lobby.
         */
        Lobby.create({
          org_id: realID,
          number: lobbyNumber,
          current_data: {};
        });
        /* 
         * The player already has their own info, 
         * so no need to send info back.
         */
        res.status(200).send({});

        return; /* Player info will be stored when they POST again */

      }

      /* Otherwise, lobby found; update it */

      var currentData = lobbyResult.dataValues.current_data || {};
      /*
       * Remove current player data so that it can be replaced
       * with latest data. Also, clean out disconnected players. 
       */
      currentData = currentData.filter(item => {
        if (!item[LAST_TIMESTAMP] || !item[PLAYER_ID]) {
          /* Timestamp or player ID missing for some reason */
          return false;
        }
        
        var diff = 
          new Date().getTime() - 
          Math.abs(parseInt(item[LAST_TIMESTAMP]));

        if (diff > DISCONNECTED_TIME_MIL) {
          /* Player likely disconnected */
          return false;
        }

        if (item[PLAYER_ID] == playerID) {
          /* Remove current data to be replaced with latest */
          return false;
        }
        /* true means keep it */
        return true;

      });

      /* Update currentData with latest data */
      if (currentData.length < maxPlayers) {
        var addData = req.body;
        addData[PLAYER_ID] = playerID;
        addData[LAST_TIMESTAMP] = new Date().getTime();
        currentData.push(addData);

        /* Send latest data to player */
        res.status(200).send(currentData);
        
        /* Add to database */
        Lobby.update(
          { current_data: currentData },
          { where: { org_id: realID, number: lobbyNumber } }
        ).then(rslt => {
        }).catch(err => {
          console.log(err);
        });

      } else {
        res.status(401).send({
          message: 'Lobby full.'
        });

      }
    }).catch(err => {
      res.status(500).send({
        'message': 'Lobby error. Error: ' + err
      });
      console.log(err);
      
    });
  }).catch(err => {
    res.status(500).send({
      'message': 'Organization ID error. Error: ' + err
    });
    console.log(err);

  });
  
});

module.exports = router;
