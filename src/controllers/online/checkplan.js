const MIN_PLAYERS = 10

const PLAN_MAX_MAP = {
  null: MIN_PLAYERS,
  0: MIN_PLAYERS,
  1: MIN_PLAYERS
}
/*
 * The plan number is how many lobbies allowed
 * plan_number: max_players
 * Free tier doesn't require a plan number
 */

module.exports = {
  checkMaxPlayers: number => {
    return PLAN_MAX_MAP[number] | MIN_PLAYERS
  },
  getLobbyAmount: plan => {
    try {
      return parseInt(plan)
    } catch (error) {
      return 1
    }
  }
}

