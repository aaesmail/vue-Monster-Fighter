function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
  data() {
    return {
      currentRound: 0,
      playerHealth: 100,
      monsterHealth: 100,
      winner: null,
      logMessages: [],
    };
  },

  computed: {
    monsterBarStyles() {
      return { width: this.monsterHealth + "%" };
    },
    playerBarStyles() {
      return { width: this.playerHealth + "%" };
    },
    mayUseSpecialAttack() {
      return this.currentRound % 3 !== 0;
    },
  },

  watch: {
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        this.winner = "draw";
      } else if (value <= 0) {
        this.winner = "monster";
      }
    },
    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        this.winner = "draw";
      } else if (value <= 0) {
        this.winner = "player";
      }
    },
  },

  methods: {
    startGame() {
      this.currentRound = 0;
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.winner = null;
      this.logMessages = [];
    },
    reduceMonsterHealth(reductionValue) {
      this.monsterHealth -= Math.min(reductionValue, this.monsterHealth);
    },
    reducePlayerHealth(reductionValue) {
      this.playerHealth -= Math.min(reductionValue, this.playerHealth);
    },
    increasePlayerHealth(increaseValue) {
      this.playerHealth += Math.min(increaseValue, 100 - this.playerHealth);
    },
    attackMonster() {
      this.currentRound++;
      const attackValue = getRandomInt(5, 12);
      this.reduceMonsterHealth(attackValue);
      this.addLogMessage("Player", "attack", attackValue);
      this.attackPlayer();
    },
    attackPlayer() {
      const attackValue = getRandomInt(8, 15);
      this.reducePlayerHealth(attackValue);
      this.addLogMessage("Monster", "attack", attackValue);
    },
    specialAttackMonster() {
      this.currentRound++;
      const attackValue = getRandomInt(10, 25);
      this.reduceMonsterHealth(attackValue);
      this.addLogMessage("Player", "special-attack", attackValue);
      this.attackPlayer();
    },
    healPlayer() {
      this.currentRound++;
      const healValue = getRandomInt(8, 20);
      this.increasePlayerHealth(healValue);
      this.addLogMessage("Player", "heal", healValue);
      this.attackPlayer();
    },
    surrender() {
      this.winner = "monster";
    },
    addLogMessage(who, what, value) {
      this.logMessages.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value,
      });
    },
  },
});

app.mount("#game");
