document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const loginModal = document.getElementById('loginModal');
    const mainHeader = document.getElementById('mainHeader');
    const mainContainer = document.getElementById('mainContainer');

    // 登录逻辑
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault(); // 阻止表单默认提交行为
        
        // 获取表单输入值
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // 简单的前端验证
        if (username && password) {
            // 模拟登录验证
            if (username === '新能源' && password === '123456') {
                // 登录成功，显示主页面内容
                loginModal.style.display = 'none';
                mainHeader.style.display = 'block';
                mainContainer.style.display = 'block';
            } else {
                alert('用户名或密码错误');
            }
        } else {
            alert('请输入用户名和密码');
        }
    });

    const homeLink = document.getElementById('home-link');
    const vehicleManagementLink = document.getElementById('vehicle-management-link');
    const mapDistributionLink = document.getElementById('map-distribution-link');
    const maintenanceAppointmentLink = document.getElementById('maintenance-appointment-link');
    const mainContent = document.getElementById('main-content');
    const mapContainer = document.getElementById('map-container');
    const mapControls = document.getElementById('map-controls');
    const map = new AMap.Map('map-container', {
        zoom: 10,
        center: [104.0668, 30.5728] // 成都的中心坐标
    });

    function showMainContent(content) {
        mainContent.innerHTML = content;
        mapContainer.style.display = 'none';
        mapControls.style.display = 'none';
    }

    function showMap() {
        mainContent.innerHTML = '';
        mapContainer.style.display = 'block';
        mapControls.style.display = 'block';
    }

    homeLink.addEventListener('click', function () {
        showMainContent(`
            <h2>欢迎使用新能源车管理系统</h2>
            <p>请选择左侧菜单中的功能进行操作。</p>
        `);
    });

    vehicleManagementLink.addEventListener('click', function () {
        showMainContent(`
            <h2>车辆管理</h2>
            <button id="addVehicleButton">添加车辆</button>
            <div id="vehicleList"></div>
        `);
        loadVehicles();

        document.getElementById('addVehicleButton').addEventListener('click', function () {
            document.getElementById('addVehicleModal').style.display = 'block';
        });
    });

    mapDistributionLink.addEventListener('click', function () {
        showMap();
    });

    maintenanceAppointmentLink.addEventListener('click', function () {
        document.getElementById('maintenanceModal').style.display = 'block';
        loadVehicleOptions();
    });

    map.on('click', function (e) {
        const lnglat = e.lnglat;
        fetchChargingStations(lnglat.getLng(), lnglat.getLat());
    });

    document.getElementById('search-charging-stations').addEventListener('click', function () {
        const location = document.getElementById('search-location').value;
        if (location) {
            geocodeLocation(location, function (lnglat) {
                fetchChargingStations(lnglat.lng, lnglat.lat);
            });
        }
    });

    function fetchChargingStations(lng, lat) {
        const url = `//uri.amap.com/marker?markers=${lng},${lat},附近充电桩&src=mypage&callnative=0`;
        console.log('Fetching charging stations from URL:', url);

        const marker = new AMap.Marker({
            position: new AMap.LngLat(lng, lat),
            title: '附近充电桩'
        });
        map.add(marker);
    }

    function geocodeLocation(address, callback) {
        AMap.plugin('AMap.Geocoder', function () {
            const geocoder = new AMap.Geocoder();
            geocoder.getLocation(address, function (status, result) {
                if (status === 'complete' && result.geocodes.length) {
                    const lnglat = result.geocodes[0].location;
                    callback(lnglat);
                } else {
                    alert('未找到该地点，请重新输入');
                }
            });
        });
    }

    function loadVehicles() {
        const vehicleList = document.getElementById('vehicleList');
        vehicleList.innerHTML = '<p>加载车辆信息...</p>';

        setTimeout(() => {
            const vehicles = [
                { id: 1, ownerName: '张三', licensePlate: '川A12345', model: '特斯拉 Model 3' },
                { id: 2, ownerName: '李四', licensePlate: '川B54321', model: '比亚迪 汉' }
            ];

            vehicleList.innerHTML = '';
            vehicles.forEach(vehicle => {
                const vehicleItem = document.createElement('div');
                vehicleItem.className = 'vehicle-item';
                vehicleItem.innerHTML = `
                    <h3>${vehicle.model}</h3>
                    <p>车主: ${vehicle.ownerName}</p>
                    <p>车牌号: ${vehicle.licensePlate}</p>
                    <button class="editVehicleButton" data-id="${vehicle.id}">编辑</button>
                `;
                vehicleList.appendChild(vehicleItem);
            });

            document.querySelectorAll('.editVehicleButton').forEach(button => {
                button.addEventListener('click', function () {
                    const vehicleId = this.getAttribute('data-id');
                    editVehicle(vehicleId);
                });
            });
        }, 1000);
    }

    function editVehicle(vehicleId) {
        const modal = document.getElementById('editVehicleModal');
        const vehicle = {
            id: vehicleId,
            ownerName: '张三',
            licensePlate: '川A12345',
            model: '特斯拉 Model 3'
        };

        document.getElementById('editVehicleId').value = vehicle.id;
        document.getElementById('editOwnerName').value = vehicle.ownerName;
        document.getElementById('editLicensePlate').value = vehicle.licensePlate;
        document.getElementById('editVehicleModel').value = vehicle.model;

        modal.style.display = 'block';
    }

    document.getElementById('addVehicleForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const ownerName = document.getElementById('ownerName').value;
        const licensePlate = document.getElementById('licensePlate').value;
        const vehicleModel = document.getElementById('vehicleModel').value;

        console.log('添加车辆:', { ownerName, licensePlate, vehicleModel });

        document.getElementById('addVehicleModal').style.display = 'none';
    });

    document.getElementById('editVehicleForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const vehicleId = document.getElementById('editVehicleId').value;
        const ownerName = document.getElementById('editOwnerName').value;
        const licensePlate = document.getElementById('editLicensePlate').value;
        const vehicleModel = document.getElementById('editVehicleModel').value;

        console.log('编辑车辆:', { vehicleId, ownerName, licensePlate, vehicleModel });

        document.getElementById('editVehicleModal').style.display = 'none';
    });

    document.getElementById('maintenanceForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const maintenanceDate = document.getElementById('maintenanceDate').value;
        const maintenanceTime = document.getElementById('maintenanceTime').value;
        const maintenanceType = document.getElementById('maintenanceType').value;
        const vehicleSelect = document.getElementById('vehicleSelect').value;

        console.log('预约维修保养:', { maintenanceDate, maintenanceTime, maintenanceType, vehicleSelect });

        document.getElementById('maintenanceModal').style.display = 'none';
    });

    document.querySelectorAll('.close').forEach(closeButton => {
        closeButton.addEventListener('click', function () {
            this.closest('.modal').style.display = 'none';
        });
    });

    function loadVehicleOptions() {
        const vehicleSelect = document.getElementById('vehicleSelect');
        vehicleSelect.innerHTML = '<option value="" disabled selected>加载车辆...</option>';

        setTimeout(() => {
            const vehicles = [
                { id: 1, model: '特斯拉 Model 3' },
                { id: 2, model: '比亚迪 汉' }
            ];

            vehicleSelect.innerHTML = '<option value="" disabled selected>请选择车辆</option>';
            vehicles.forEach(vehicle => {
                const option = document.createElement('option');
                option.value = vehicle.id;
                option.textContent = vehicle.model;
                vehicleSelect.appendChild(option);
            });
        }, 1000);
    }
});
