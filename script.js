document.addEventListener('DOMContentLoaded', () => {
    const apiForm = document.getElementById('apiForm');
    const apiForm2 = document.getElementById('apiForm2');
    const apiForm3 = document.getElementById('apiForm3');
    const resultsDiv = document.getElementById('results');
    const downloadButton = document.getElementById('downloadButton');
    const htmlDownloadButton = document.getElementById('htmlDownloadButton');
    const titleDownloadButton = document.getElementById('titleDownloadButton');
    const searchIcon = document.getElementById('searchIcon');
    const formContainer = document.getElementById('formContainer');
    const closeButton = document.getElementById('closeButton');
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const menuContainer = document.getElementById('menuContainer');
    const menuCloseButton = document.getElementById('menuCloseButton');
    let apiResults = [];

    function toggleFormContainer() {
        if (formContainer.style.left === '0px') {
            formContainer.style.left = '-300px';
            searchIcon.innerHTML = '◉';
        } else {
            formContainer.style.left = '0';
            searchIcon.innerHTML = '&times;';
        }
    }

    function toggleMenuContainer() {
        if (menuContainer.style.right === '0px') {
            menuContainer.style.right = '-300px';
            hamburgerMenu.innerHTML = '&#9776;';
        } else {
            menuContainer.style.right = '0';
            hamburgerMenu.innerHTML = '&times;';
        }
    }

    searchIcon.addEventListener('click', toggleFormContainer);
    // closeButton.addEventListener('click', toggleFormContainer);

    hamburgerMenu.addEventListener('click', toggleMenuContainer);
    // menuCloseButton.addEventListener('click', toggleMenuContainer);


    // 商品検索
    apiForm.addEventListener('submit', async (event) => {

        const gteDateInput = document.getElementById('gte_date').value;
        const lteDateInput = document.getElementById('lte_date').value;

            if (gteDateInput) {
                const gteDateISO = new Date(gteDateInput).toISOString();
                console.log('以降:', gteDateISO);
                document.getElementById('gte_date').value = gteDateISO;
            }

            if (lteDateInput) {
                const lteDateISO = new Date(lteDateInput).toISOString();
                console.log('以前:', lteDateISO);
                document.getElementById('lte_date').value = lteDateISO;
            }

        event.preventDefault();
        const formData = new FormData(apiForm);
        const params = new URLSearchParams(formData).toString();
        const apiUrl = `https://api.dmm.com/affiliate/v3/ItemList?${params}&output=json`;
        console.log(apiUrl);

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            apiResults = data.result.items;
            displayResultsSyohin(apiResults);
        } catch (error) {
            resultsDiv.textContent = 'APIリクエストに失敗しました。';
        }
    });

    function displayResultsSyohin(items) {
        resultsDiv.innerHTML = '';
        if (items.length > 0) {
            items.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'item';

                const title = document.createElement('h3');
                title.textContent = item.title;

                const image = document.createElement('img');
                image.src = item.imageURL.large;

                const link = document.createElement('a');
                link.href = item.URL;
                link.textContent = '詳細を見る';
                link.target = '_blank';

                itemDiv.appendChild(title);
                itemDiv.appendChild(image);
                itemDiv.appendChild(link);
                resultsDiv.appendChild(itemDiv);
            });
        } else {
            resultsDiv.textContent = '結果が見つかりませんでした。';
        }
    }


    // 女優検索
    apiForm2.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(apiForm2);
            const params = new URLSearchParams(formData).toString();
            const apiUrl = `https://api.dmm.com/affiliate/v3/ActressSearch?${params}`;

            try {
                const response = await fetch(apiUrl);
                const data = await response.json();
                apiResults = data.result.actress;
                displayResultsJoyu(apiResults);
            } catch (error) {
                resultsDiv.textContent = 'APIリクエストに失敗しました。';
            }
        });

    function displayResultsJoyu(actress) {
            resultsDiv.innerHTML = '';
            if (actress.length > 0) {
                actress.forEach(actress => {

                    // try{
                    const actressDiv = document.createElement('div');
                    actressDiv.className = 'item';

                    const name = document.createElement('h3');
                    name.textContent = actress.name;

                    const id = document.createElement('p');
                    id.textContent = `女優ID: ${actress.id}`;

                    // const bust = document.createElement('p');
                    // bust.textContent = `バスト: ${actress.bust}`;

                    // const waist = document.createElement('p');
                    // waist.textContent = `ウエスト: ${actress.waist}`;

                    // const hip = document.createElement('p');
                    // hip.textContent = `ヒップ: ${actress.hip}`;

                    const image = document.createElement('img');
                    if ('imageURL' in actress) {
                        image.src = actress.imageURL.large;
                      } else {
                        image.src = "https://placehold.jp/100x100.png";
                      }

                    const link = document.createElement('a');
                    link.href = actress.listURL.digital;
                    link.textContent = '詳細を見る';
                    link.target = '_blank';

                    actressDiv.appendChild(name);
                    // actressDiv.appendChild(bust);
                    // actressDiv.appendChild(waist);
                    // actressDiv.appendChild(hip);
                    actressDiv.appendChild(image);
                    actressDiv.appendChild(id);
                    actressDiv.appendChild(link);
                    resultsDiv.appendChild(actressDiv);
                // }catch{
                //         return;
                //     }
                });
            } else {
                resultsDiv.textContent = '結果が見つかりませんでした。';
            }
    }
        
    apiForm3.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(apiForm3);
            const params = new URLSearchParams(formData).toString();
            const apiUrl = `https://api.dmm.com/affiliate/v3/FloorList?${params}`;
            
            try {
                const response = await fetch(apiUrl);
                const data = await response.json();
                apiResults = data.result.site;
                displayResultsFloor(apiResults);
            } catch (error) {
                resultsDiv.textContent = 'APIリクエストに失敗しました。';
            }
        });

        function displayResultsFloor(site) {
            resultsDiv.innerHTML = '';
            if (site.length > 0) {
                site.forEach(site => {
                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'item';

                    const name = document.createElement('h3');
                    name.textContent = site.name;

                    const  code = document.createElement('p');
                    code.textContent = `CODE: ${site. code}`;

                    itemDiv.appendChild(name);
                    itemDiv.appendChild(code);
                    
                    const service = site.service;

                    if (service.length > 0) {
                        service.forEach(service => {
                            const serviceName = document.createElement('p');
                            serviceName.textContent = `NAME: ${service.name}`;

                            const serviceCode = document.createElement('p');
                            serviceCode.textContent = `CODE: ${service.code}`;

                            itemDiv.appendChild(serviceName);
                            itemDiv.appendChild(serviceCode);

                            const floor = service.floor;

                            if (floor.length > 0) {
                                floor.forEach(floor => {
                                    const floorName = document.createElement('p');
                                    floorName.textContent = `---FloorName: ${floor.name}`;
    
                                    const floorCode = document.createElement('p');
                                    floorCode.textContent = `---FloorCode: ${floor.code}`;

                                    const floorId = document.createElement('p');
                                    floorId.textContent = `---FloorId: ${floor.id}`;
    
                                    itemDiv.appendChild(floorName);
                                    itemDiv.appendChild(floorCode);
                                    itemDiv.appendChild(floorId);

                                });
                            } else {
                                    resultsDiv.textContent = 'floorの結果が見つかりませんでした。';
                            }
                        });
                    } else {
                            resultsDiv.textContent = 'serviceの結果が見つかりませんでした。';
                    }
                    resultsDiv.appendChild(itemDiv);
                });
            } else {
                resultsDiv.textContent = '結果が見つかりませんでした。';
            }
        }    

    // ダウンロード機能
    downloadButton.addEventListener('click', () => {
        if (apiResults.length > 0) {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(apiResults));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "results.json");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        } else {
            alert('ダウンロードする結果がありません。');
        }
    });

    // HTML形式ダウンロード機能
    htmlDownloadButton.addEventListener('click', () => {
        if (apiResults.length > 0) {
            const textData = apiResults.map((item, index) => {
                return `<div style="margin:0;padding:5px;font-size:12px;word-break: break-all;"><a href="${item.affiliateURL}" rel="sponsored" style="display:block;text-align:center;"><img src="${item.imageURL.large}"style="margin:0;padding:0;border:0;max-width:100%"><span style="display:block;margin:5px 0 0 0;padding:0;text-align:left;">${item.title}</span></a><p style="margin:5px 0 0 0;padding:0;color:#8c8c8c;font-size:10px;"></p></div>`;
            }).join('\n');

            const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(textData);
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "gachaItems.txt");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        } else {
            alert('ダウンロードする結果がありません。');
        }
    });

    // タイトルダウンロード機能
    titleDownloadButton.addEventListener('click', () => {
        if (apiResults.length > 0) {
            const textData = apiResults.map((item, index) => {
                return item.title;
            }).join('\n');

            const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(textData);
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "wordCloud.txt");
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        } else {
            alert('ダウンロードする結果がありません。');
        }
    });



});


document.addEventListener('DOMContentLoaded', function() {
    const serviceSelect = document.getElementById('service');
    const floorSelect = document.getElementById('floor');

    const floorOptions = {
        "digital": [
            { value: "", text: "絞り込みなし" },
            { value: "videoa", text: "videoa" },
            { value: "videoc", text: "videoc" }
        ],
        "pcgame": [
            { value: "", text: "絞り込みなし" }
        ],
        "doujin": [
            { value: "", text: "絞り込みなし" },
            { value: "digital_doujin", text: "digital_doujin" }
        ],
        "ebook": [
            { value: "", text: "絞り込みなし" },
            { value: "comic", text: "comic" }
        ],
        "default": [
            { value: "", text: "絞り込みなし" }
        ]
    };

    serviceSelect.addEventListener('change', function() {
        const selectedService = serviceSelect.value;
        updateFloorOptions(selectedService);
    });

    function updateFloorOptions(service) {
        while (floorSelect.firstChild) {
            floorSelect.removeChild(floorSelect.firstChild);
        }

        const options = floorOptions[service] || floorOptions["default"];
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.text = option.text;
            floorSelect.appendChild(optionElement);
        });
    }

    // 初期状態のfloor選択肢を設定
    updateFloorOptions(serviceSelect.value);
});