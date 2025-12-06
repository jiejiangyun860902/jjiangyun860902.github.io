// 网点数据 - 这里先用模拟数据，后面可以替换为真实数据
const storesData = [
    {
        id: 1,
        name: "捷匠云-幸福社区服务点",
        lng: 116.397428,
        lat: 39.90923,
        address: "北京市东城区幸福小区3号楼便利店",
        services: ["家电维修", "管道疏通", "开锁换锁", "灯具安装"],
        contact: "张师傅",
        phone: "13800138001"
    },
    {
        id: 2,
        name: "捷匠云-阳光社区服务点", 
        lng: 116.407428,
        lat: 39.91923,
        address: "北京市朝阳区阳光小区5号楼菜鸟驿站",
        services: ["家电维修", "电脑维修", "网络布线"],
        contact: "李师傅",
        phone: "13800138002"
    },
    {
        id: 3,
        name: "捷匠云-和平社区服务点",
        lng: 116.387428,
        lat: 39.89923,
        address: "北京市西城区和平小区1号楼水果店",
        services: ["管道疏通", "水电维修", "墙面修补"],
        contact: "王师傅", 
        phone: "13800138003"
    }
];

// 全局变量
let map;
let markers = [];
let allServices = [];

// 初始化地图
function initMap() {
    // 创建地图实例
    map = new AMap.Map('map-container', {
        zoom: 13, // 缩放级别
        center: [116.397428, 39.90923] // 中心点坐标（北京）
    });
    
    // 添加缩放控件
    map.addControl(new AMap.Zoom());
    
    // 添加比例尺控件
    map.addControl(new AMap.Scale());
    
    // 初始化服务筛选器
    initServiceFilter();
    
    // 添加所有网点标记
    addAllStoresToMap();
}

// 初始化服务筛选器
function initServiceFilter() {
    const filterContainer = document.querySelector('.filter-tags');
    
    // 收集所有服务类型
    allServices = [];
    storesData.forEach(store => {
        allServices = allServices.concat(store.services);
    });
    
    // 去重并排序
    allServices = [...new Set(allServices)].sort();
    
    // 生成筛选按钮
    allServices.forEach(service => {
        const button = document.createElement('button');
        button.className = 'filter-btn';
        button.textContent = service;
        button.setAttribute('data-service', service);
        button.onclick = () => filterStoresByService(service);
        filterContainer.appendChild(button);
    });
}

// 添加所有网点到地图
function addAllStoresToMap() {
    storesData.forEach(store => {
        addStoreToMap(store);
    });
}

// 添加单个网点到地图
function addStoreToMap(store) {
    // 创建自定义标记内容
    const markerContent = `
        <div class="custom-marker">
            <div class="marker-icon">捷</div>
            <div class="marker-badge">${store.services.length}</div>
        </div>
    `;
    
    // 创建标记
    const marker = new AMap.Marker({
        content: markerContent,
        position: [store.lng, store.lat],
        offset: new AMap.Pixel(-20, -20)
    });
    
    // 存储网点数据到标记
    marker.storeData = store;
    
    // 添加点击事件
    marker.on('click', function() {
        showStoreInfo(store);
    });
    
    // 添加到地图
    map.add(marker);
    
    // 保存到标记数组
    markers.push(marker);
}

// 显示网点信息
function showStoreInfo(store) {
    // 创建信息窗口内容
    const infoContent = `
        <div class="info-window">
            <div class="info-title">${store.name}</div>
            <div style="font-size:12px;color:#666;margin-bottom:8px;">${store.address}</div>
            <div class="service-tags">
                ${store.services.map(service => 
                    `<span class="service-tag">${service}</span>`
                ).join('')}
            </div>
            <div class="contact-info">
                <div>联系人：${store.contact}</div>
                <div>电话：${store.phone}</div>
            </div>
        </div>
    `;
    
    // 创建信息窗口
    const infoWindow = new AMap.InfoWindow({
        content: infoContent,
        offset: new AMap.Pixel(0, -30)
    });
    
    // 打开信息窗口
    infoWindow.open(map, [store.lng, store.lat]);
}

// 根据服务类型筛选网点
function filterStoresByService(service) {
    // 更新按钮状态
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-service') === service) {
            btn.classList.add('active');
        }
    });
    
    // 筛选标记
    markers.forEach(marker => {
        if (service === 'all' || marker.storeData.services.includes(service)) {
            marker.show();
        } else {
            marker.hide();
        }
    });
}

// 页面加载完成后初始化地图
window.onload = initMap;