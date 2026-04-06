<template>
  <div ref="canvasContainer" style="width: 60%; height: 50vh;" />
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default {
  mounted() {
    this.initThreeJS()
  },
  methods: {
    initThreeJS() {
      const container = this.$refs.canvasContainer

      // 创建场景
      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0x000000) // 设置背景颜色

      // 创建相机
      const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000)
      camera.position.z = 5

      // 创建渲染器
      const renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setSize(container.clientWidth, container.clientHeight)
      container.appendChild(renderer.domElement)

      // 添加光源
      const ambientLight = new THREE.AmbientLight(0xffffff, 2) // 环境光
      scene.add(ambientLight)

      const pointLight = new THREE.PointLight(0xffffff, 1)
      pointLight.position.set(10, 10, 10)
      scene.add(pointLight)

      // 创建简易模型（立方体）
      const geometry = new THREE.BoxGeometry()
      const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 }) // 使用 Lambert 材质以便更好地表现光照效果
      const cube = new THREE.Mesh(geometry, material)
      scene.add(cube)

      // 创建射线投射器
      const raycaster = new THREE.Raycaster()
      const mouse = new THREE.Vector2()
      const clickableObjects = []

      // 添加点击点的函数
      const addClickablePoints = (scene) => {
        const pointGeometry = new THREE.SphereGeometry(0.1, 32, 32)
        const pointMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 }) // 使用 Lambert 材质
        const point1 = new THREE.Mesh(pointGeometry, pointMaterial)
        point1.position.set(1, 1, 1) // 设置点的位置
        scene.add(point1)
        clickableObjects.push(point1)

        // 如果需要添加更多点击点，可以重复上述过程
      }

      addClickablePoints(scene)

      // 创建 OrbitControls 以便通过鼠标控制
      const controls = new OrbitControls(camera, renderer.domElement)

      // 处理点击事件
      const onDocumentMouseClick = (event) => {
        event.preventDefault()

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

        raycaster.setFromCamera(mouse, camera)

        const intersects = raycaster.intersectObjects(scene.children)

        if (intersects.length > 0) {
          console.log('Clicked on object:', intersects[0].object)
        }
      }

      // window.addEventListener('click', onDocumentMouseClick, false)

      // 动画循环
      const animate = function() {
        requestAnimationFrame(animate)
        controls.update() // 更新控制
        renderer.render(scene, camera)
      }

      animate()

      // 窗口大小改变时更新渲染器和相机
      window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight
        camera.updateProjectionMatrix()
        renderer.setSize(container.clientWidth, container.clientHeight)
      })
    }
  }
}
</script>

<style scoped>
  div {
    width: 100%;
    height: 100%;
  }
</style>
