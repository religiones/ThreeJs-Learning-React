import React from 'react';
import { useEffect, useState } from 'react';
import Stats from "stats.js"
import * as dat from 'dat.gui'
import * as THREE from 'three'
import { AxesHelper } from 'three';

//外部参数
export type three1Props = {
    SCREEN_WIDTH: number,
    SCREEN_HEIGHT: number
}

//内部状态
type three1State = {
    container: React.RefObject<HTMLDivElement>,    //DOM容器
    scene: THREE.Scene,     //场景
    camera: THREE.PerspectiveCamera,   //相机
    renderer: THREE.WebGLRenderer,    //渲染器
    bgColor: THREE.Color,   //窗口背景色
    axes: THREE.AxesHelper,      //坐标轴
    spotLight: THREE.Light,      //光源
    controls: {             // 控制面板
        rotationSpeed: number,
        bouncingSpeed: number
    }   
}

const Three1: React.FC<three1Props> = (props) => {
    const {SCREEN_WIDTH, SCREEN_HEIGHT} = props;
    const ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;

    const [three1State, setThree1State] = useState<three1State>({
        container: React.createRef(),    
        scene: new THREE.Scene(),
        camera: new THREE.PerspectiveCamera(45, ASPECT, 0.1, 1000),
        renderer: new THREE.WebGLRenderer(),
        bgColor: new THREE.Color(0x000000),
        axes: new AxesHelper(20),
        spotLight: new THREE.SpotLight(0xFFFFFF),
        controls: {
            rotationSpeed: 0.01,
            bouncingSpeed: 0.01
        }
    });

    // 显示帧数
    const initStats = (type?: number) => {
        let panelType = (typeof type !== 'undefined' && type) && (!isNaN(type)) ? type : 0;
        let stats = new Stats();
        stats.showPanel(panelType);     // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(stats.dom);
        return stats;
    }

    // 控制面板
    const initControls = () => {
        let {controls} = three1State;
        let gui = new dat.GUI();
        gui.add(controls, "rotationSpeed", 0, 0.5);
        gui.add(controls, "bouncingSpeed", 0, 0.5);
    }

    //初始化
    const init = () => {
        //初始化帧数面板
        const stats = initStats();
        //初始化控制面板
        initControls();
        const {container, scene, camera, renderer, bgColor, axes, spotLight} = three1State;
        //设定背景色
        renderer.setClearColor(bgColor);
        //设定窗口大小
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        //渲染阴影效果
        renderer.shadowMap.enabled = true;
        //设定坐标轴
        scene.add(axes);
        //设定光源
        spotLight.position.set(-40, 40, 15);
        spotLight.castShadow = true;    //设定阴影, 并不是所有光源都能产生阴影
        spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
        scene.add(spotLight);
        //添加平面
        const planeGeometry = new THREE.PlaneGeometry(60, 20);
        const planeMaterial = new THREE.MeshLambertMaterial({color: 0xAAAAAA});     //MeshBasicMaterial基本材质不会对光源有反应
        const panel = new THREE.Mesh(planeGeometry, planeMaterial);  //设定平面
        panel.rotateX(-0.5*Math.PI);    //设定平面角度, 绕x轴旋转90度
        panel.position.set(15, 0, 0);   //设定平面位置  红线x 绿线y 蓝线z
        panel.receiveShadow = true;     //平面接受阴影
        scene.add(panel);
        //添加方块
        const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
        const cubeMaterial = new THREE.MeshLambertMaterial({color: 0xFF0000});
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(-4, 3, 0);
        cube.castShadow = true;     //方块投射阴影
        scene.add(cube);
        //添加球体
        const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
        const sphereMaterial = new THREE.MeshLambertMaterial({color: 0x00FF00});
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(20, 4, 2);
        sphere.castShadow = true;       //球体投射阴影
        scene.add(sphere);
        //设定相机
        camera.position.set(-30, 40, 30);  //设定相机位置   默认是0 0 0
        camera.lookAt(scene.position);   //设定相机朝向
        //添加到Dom节点
        container.current?.appendChild(renderer.domElement);

        // 添加动画
        let step = 0;
        const renderScene = () => {
            const {controls} = three1State;
            stats.update();     //更新帧数
            step += controls["bouncingSpeed"];        //小球跳跃速度
            cube.rotation.z += controls["rotationSpeed"];     //方块绕z轴旋转
            sphere.position.x = 20 + 10 * (Math.cos(step));
            sphere.position.y = 2 + 10 * Math.abs(Math.sin(step));
            requestAnimationFrame(renderScene);     //由浏览器决定渲染时间
            renderer.render(scene, camera);
        }

        renderScene();
    }

    // 重置摄像机位置
    const onResize = () => {
        const {camera, renderer} = three1State;
        camera.aspect = window.innerHeight / window.innerWidth;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // componentDidMount
    useEffect(() => {
        init();
        window.addEventListener('resize', onResize, false);
    }, []);

    return(
        <div ref={three1State.container}></div>
    )
}

export default Three1