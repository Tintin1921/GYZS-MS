<template>
  <div class="game">
    <div class="game-div">
      <div class="game-min">
        <div v-for="(e, i) in frame" :key="i" class="row">
          <p
            v-for="(b, i) in e"
            :key="i"
            class="element"
            :style="{ background: b.bg }"
          />
        </div>
      </div>
      <!-- 分数计算 -->
      <div class="right-div">
        <div>
          <p>
            <span>得分:</span>&emsp;<span style="color: red">{{ score }}</span>
          </p>
        </div>
        <div>
          <p>
            <span>等级:</span>&emsp;<span style="color: red">{{ level }}</span>
          </p>
        </div>
        <div>
          <p>
            <span>吃:</span>&emsp;<span style="color: red">{{ times }}</span>
          </p>
        </div>
        <el-button type="dangers" @click="autoMove">暂停</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { color } from './color'
export default {
  data() {
    return {
      row: 20,
      col: 20, // 列
      frame: [], // 界面
      bg: '#eee', // 默认背景色
      snake: {}, // 蛇
      food: {}, // 食物
      color: color[0],
      over: false, // 边界判断
      timer: '',
      speed: 300, // 速度
      fx: 0, // 方向：0左 1右 2上 3下
      times: 0,
      level: 1,
      score: 0,
      site: 0 // 食物生成位置
    }
  },
  mounted() {
    this.gameFrame()
    this.initSnake()
    this.initFood()
    this.autoMove()
    // 监听用户键盘输入
    window.addEventListener('keydown', this.manualMove)
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.manualMove)
  },
  methods: {
    //   游戏框架
    gameFrame() {
      for (let i = 0; i < this.row; i++) {
        const a = []
        for (let j = 0; j < this.col; j++) {
          const b = {
            bg: this.bg
          }
          a.push(b)
        }
        this.frame.push(a)
      }
    },
    // 初始化蛇
    initSnake() {
      this.snake = {
        // site: [9, 0, 9, 1, 9, 2],
        site: [9, 8, 9, 9, 9, 10],
        color: this.color[6]
      }
      this.renderBlock(this.snake, this.frame, 1)
    },
    // 方块渲染
    // a:方块  b:渲染位置  n:类型(0清除 1渲染)
    renderBlock(a, b, n) {
      const c = a.site
      if (n === 1) {
        for (let i = 0; i < c.length; i += 2) {
          b[c[i]][c[i + 1]].bg = a.color
        }
      } else if (n === 0) {
        for (let i = 0; i < c.length; i += 2) {
          b[c[i]][c[i + 1]].bg = this.bg
        }
      }
    },
    // 食物
    initFood() {
      this.sFood()
      const site = this.site
      const color = this.color[Math.floor(Math.random() * 7)]
      this.food = {
        site,
        color
      }
      this.renderBlock(this.food, this.frame, 1)
    },
    // 防止食物生成在蛇身shang
    sFood() {
      this.site = [
        Math.floor(Math.random() * this.row),
        Math.floor(Math.random() * this.col)
      ]
      for (let i = 0; i < this.snake.site.length; i += 2) {
        if (
          this.snake.site[i] === this.site[0] &&
          this.snake.site[i + 1] === this.site[1]
        ) {
          this.sFood()
        }
      }
    },
    // 向左
    moveLeft() {
      if (!this.over && this.fx !== 1) {
        this.fx = 0
        clearInterval(this.timer) // 避免定时器造成死循环
        this.timer = setInterval(() => {
          this.renderBlock(this.snake, this.frame, 0) // 同时清空,否则的蛇长一直加1
          //   for (let i = 0; i < this.snake.site.length; i += 2) {
          //     this.snake.site[i + 1]--;
          //   }//一起动
          this.eat(this.snake.site[0], this.snake.site[1] - 1)
          this.move() // 先判断再动
          this.snake.site[1]--
          if (this.snake.site[1] < 0) {
            this.over = true
            console.log('撞墙了')
            this.snake.site[1]++
            this.oneself()
            clearInterval(this.timer)
          }
          this.renderBlock(this.snake, this.frame, 1) // 向左动
        }, this.speed)
      }
    },
    // 向右
    moveRight() {
      if (!this.over && this.fx !== 0) {
        this.fx = 1
        clearInterval(this.timer)
        this.timer = setInterval(() => {
          this.renderBlock(this.snake, this.frame, 0) // 同时清空
          this.eat(this.snake.site[0], this.snake.site[1] + 1)
          this.move()
          this.snake.site[1]++
          if (this.snake.site[1] >= this.col) {
            this.over = true
            this.snake.site[1]--
            this.oneself()
            clearInterval(this.timer)
          }
          this.renderBlock(this.snake, this.frame, 1)
        }, this.speed)
      }
    },
    // 向上
    moveTop() {
      if (!this.over && this.fx !== 3) {
        this.fx = 2
        clearInterval(this.timer)
        this.timer = setInterval(() => {
          this.renderBlock(this.snake, this.frame, 0)
          this.eat(this.snake.site[0] - 1, this.snake.site[1])
          this.move()
          this.snake.site[0]--
          if (this.snake.site[0] < 0) {
            this.over = true
            this.snake.site[0]++
            this.oneself()
            clearInterval(this.timer)
          }
          this.renderBlock(this.snake, this.frame, 1)
        }, this.speed)
      }
    },
    // 向下
    moveBottom() {
      if (!this.over && this.fx !== 2) {
        this.fx = 3
        clearInterval(this.timer)
        this.timer = setInterval(() => {
          this.renderBlock(this.snake, this.frame, 0)
          this.eat(this.snake.site[0] + 1, this.snake.site[1])
          this.move()
          this.snake.site[0]++
          if (this.snake.site[0] >= this.row) {
            this.over = true
            this.snake.site[0]--
            this.oneself()
            clearInterval(this.timer)
          }
          this.renderBlock(this.snake, this.frame, 1)
        }, this.speed)
      }
    },
    // 蛇身运动
    move() {
      // 原理：上面4个方法是第一个方块移动，当第一个移动，后面的方块依次转化为前面的坐标
      for (let i = this.snake.site.length - 1; i > 1; i -= 2) {
        this.snake.site[i] = this.snake.site[i - 2]
        this.snake.site[i - 1] = this.snake.site[i - 3] // 纵坐标
      }
    },
    // 碰到自己
    oneself() {
      // 拿当前头部来与身体对比
      const t = [this.snake.site[0], this.snake.site[1]]
      for (let i = this.snake.site.length - 1; i > 1; i -= 2) {
        if (this.snake.site[i] === t[1] && this.snake.site[i - 1] === t[0]) {
          clearInterval(this.timer)
          this.over = true
          console.log('碰到自己')
        }
      }
    },
    // 吃
    eat(i, j) {
      if (i === this.food.site[0] && j === this.food.site[1]) {
        // 从蛇头部插入该点
        this.snake.site.unshift(this.food.site[0], this.food.site[1])
        // 重新生成下一个食物
        this.initFood()
        this.times++
        const lev = Math.floor(this.times / 10) + 1
        if (lev > this.level) {
          this.level = lev
          // 算速度
          if (this.level < 15) {
            // 20级以内用简单的减法
            this.speed = 600 - (this.level - 1) * 40
          } else {
            // 当大于该等级时速度不变
            this.speed = 30
          }
          clearInterval(this.timer)
          this.autoMove()
        }
        // 算分
        this.score += this.level * 100
      }
    },
    // 自动移动
    autoMove() {
      if (this.timer) {
        // 暂停
        clearInterval(this.timer)
        this.timer = ''
      } else {
        //   移动
        if (this.fx === 0) {
          this.moveLeft()
        } else if (this.fx === 2) {
          this.moveTop()
        } else if (this.fx === 1) {
          this.moveRight()
        } else if (this.fx === 3) {
          this.moveBottom()
        }
      }
    },
    // 键盘输入后控制移动
    manualMove(event) {
      if (event) {
        const getMove = event.key
        if (getMove === 'a') {
          this.moveLeft()
        } else if (getMove === 'w') {
          this.moveTop()
        } else if (getMove === 'd') {
          this.moveRight()
        } else if (getMove === 's') {
          this.moveBottom()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.game {
  .game-div {
    display: flex;
    .game-min {
      p {
        padding: 0;
        margin: 0;
      }
      .row {
        display: flex;
        padding-bottom: 2px;
        .element {
          width: 15px;
          height: 15px;
          margin-right: 2px;
        }
      }
    }
    .right-div {
      div {
        height: 20px;
        line-height: 20px;
      }
    }
  }
}
</style>
