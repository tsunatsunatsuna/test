
const apiID = "X3ZqkRC0rEpXKPM6q6mF";
const affiliateID = "hnagacha-990";

document.getElementById('searchIcon').addEventListener('click', function() {
    const formContainer = document.getElementById('formContainer');
    formContainer.classList.toggle('open');
  });

document.addEventListener("DOMContentLoaded", () => {
  const apiForm = document.getElementById("apiForm");
  const actressSearchForm = document.getElementById("actressSearchForm");
  const genreSearchForm = document.getElementById("genreSearchForm");
  const resultsDiv = document.getElementById("results");
  const downloadButton = document.getElementById("downloadButton");
  const htmlDownloadButton = document.getElementById("htmlDownloadButton");
  const titleDownloadButton = document.getElementById("titleDownloadButton");
  let apiResults = [];

  // モーダル----------------------------------------------------------------------------------------
  // モーダル要素とボタン要素を取得
  const actressModal = document.getElementById("actressModal");
  const openActressModalButton = document.getElementById("openActressSearchButton");
  const closeActressModalButton = document.getElementById("closeActressModalButton");
  const genreModal = document.getElementById("genreModal");
  const openGenreModalButton = document.getElementById("openGenreSearchButton");
  const closeGenreModalButton = document.getElementById("closeGenreModalButton");

  // モーダルを開くための関数
  function openModal() {
    modal.style.display = "block";
  }

  // モーダルを閉じるための関数
  function closeModal() {
    modal.style.display = "none";
  }

  // モーダルを開くボタンがクリックされたときにモーダルを開く
  openActressModalButton.addEventListener("click", () => {
    actressModal.style.display = "flex";
});
  openGenreModalButton.addEventListener("click", () => {
    setFloorIdToForm();
    genreModal.style.display = "flex";
});

  // 閉じるボタンがクリックされたときにモーダルを閉じる
  closeActressModalButton.addEventListener("click", () => {
    actressModal.style.display = "none";
});
  closeGenreModalButton.addEventListener("click", () => {
    genreModal.style.display = "none";
});

  // モーダルの外側をクリックしたときにもモーダルを閉じる
  window.addEventListener("click", (event) => {
    if (event.target === actressModal) {
        actressModal.style.display = "none";
    }else if (event.target === genreModal) {
        genreModal.style.display = "none";
    }
  });


  // 商品検索-------------------------------------------------------------------------------
  apiForm.addEventListener("submit", async (event) => {

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
    const params = new URLSearchParams(formData);
    
    // 絞り込み項目の値を収集
    const checkboxes = document.querySelectorAll('#articleOptions input[type="checkbox"]:checked');
    checkboxes.forEach((checkbox, index) => {
        params.append(`article[${index}]`, checkbox.value);
    });
    
    // 絞り込みIDの値を収集
    const articleIdInput = document.getElementById("article_id");
    const articleIds = articleIdInput.value.trim().split(/\s+/);
    articleIds.forEach((id, index) => {
        params.append(`article_id[${index}]`, id);
    });
    
    // submitParamsをURLSearchParams形式で作成
    const submitParams = new URLSearchParams(params);
    
    // 不要なarticle[]キーを削除
    submitParams.delete("article[]");
    submitParams.delete("article_id");
    
    // 結果を表示（または他の処理）
    console.log(submitParams.toString());
    
    // APIリクエストに使用する場合
    const apiUrl = `https://api.dmm.com/affiliate/v3/ItemList?${submitParams.toString()}&api_id=${apiID}&affiliate_id=${affiliateID}&output=json`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        apiResults = data.result.items;
        displayResultsSyohin(apiResults);
    } catch (error) {
        resultsDiv.textContent = "APIリクエストに失敗しました。";
    }
  });

  // 女優検索-------------------------------------------------------------------------------
  actressSearchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(actressSearchForm);
    const params = new URLSearchParams(formData).toString();
    const apiUrl = `https://api.dmm.com/affiliate/v3/ActressSearch?${params}&api_id=${apiID}&affiliate_id=${affiliateID}&output=json`;

    console.log(params);
    console.log(apiUrl);
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const actresses = data.result.actress;
        displayResultsActress(actresses);
    } catch (error) {
        resultsDiv.textContent = "APIリクエストに失敗しました。";
    }
  });

  // ジャンル検索-------------------------------------------------------------------------------
  genreSearchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(genreSearchForm);
    const floorID = formData.get("floor_id");
    const apiUrl = `https://api.dmm.com/affiliate/v3/GenreSearch?api_id=${apiID}&affiliate_id=${affiliateID}&floor_id=${floorID}&hits=100&offset=1&output=json`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const genres = data.result.genre;
        displayResultsGenre(genres);
    } catch (error) {
        resultsDiv.textContent = "APIリクエストに失敗しました。";
    }
  });



  // 関数：商品結果-------------------------------------------------------------------------------
  function displayResultsSyohin(items) {
    resultsDiv.innerHTML = "";
    if (items.length > 0) {
      items.forEach((item) => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "item";

        const title = document.createElement("h3");
        title.textContent = item.title;

        const image = document.createElement("img");
        image.src = item.imageURL.large;

        const link = document.createElement("a");
        link.href = item.URL;
        link.textContent = "詳細を見る";
        link.target = "_blank";

        itemDiv.appendChild(title);
        itemDiv.appendChild(image);
        itemDiv.appendChild(link);
        resultsDiv.appendChild(itemDiv);
      });
    } else {
      resultsDiv.textContent = "結果が見つかりませんでした。";
    }
  }

  // 関数：女優結果-------------------------------------------------------------------------------
  function displayResultsActress(actresses) {
    const actressForm = document.getElementById("actressForm");
    actressForm.innerHTML = ""; // 既存の内容をクリア

    resultsDiv.innerHTML = "";
    if (actresses.length > 0) {
      actresses.forEach((actress) => {
        // const actressForm = document.getElementById('actressForm');
        // actressForm.innerHTML = ''; // 既存の内容をクリア

        const label = document.createElement("label");
        label.textContent = actress.name;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = actress.id;
        checkbox.name = "selectedActresses";

        // チェックボックスの変更イベントをリッスンして値を動的に更新
        checkbox.addEventListener("change", updateArticleId);

        label.appendChild(checkbox);
        actressForm.appendChild(label);
        actressForm.appendChild(document.createElement("br")); // 改行を挿入

        const actressDiv = document.createElement("div");
        actressDiv.className = "item";

        const name = document.createElement("h3");
        name.textContent = actress.name;

        const id = document.createElement("p");
        id.textContent = `女優ID: ${actress.id}`;

        const image = document.createElement("img");
        if ("imageURL" in actress) {
          image.src = actress.imageURL.large;
        } else {
          image.src = "https://placehold.jp/100x100.png";
        }

        const link = document.createElement("a");
        link.href = actress.listURL.digital;
        link.textContent = "詳細を見る";
        link.target = "_blank";

        actressDiv.appendChild(name);
        actressDiv.appendChild(image);
        actressDiv.appendChild(id);
        actressDiv.appendChild(link);
        resultsDiv.appendChild(actressDiv);
      });
    } else {
      resultsDiv.textContent = "結果が見つかりませんでした。";
    }
  }

  // 関数：ジャンル結果-------------------------------------------------------------------------------
  function displayResultsGenre(genres) {
    genreForm.innerHTML = ""; // 既存の内容をクリア

    if (genres.length > 0) {
      genres.forEach((genre) => {
        const label = document.createElement("label");
        label.textContent = genre.name;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = genre.genre_id;
        checkbox.name = "selectedGenres";

        // チェックボックスの変更イベントをリッスンして値を動的に更新
        checkbox.addEventListener("change", updateArticleId);

        label.appendChild(checkbox);
        genreForm.appendChild(label);
        genreForm.appendChild(document.createElement("br")); // 改行を挿入
      });
    } else {
      genreForm.textContent = "結果が見つかりませんでした。";
    }
  }

  // ダウンロード機能-------------------------------------------------------------------------------
  // 結果ダウンロード
  downloadButton.addEventListener("click", () => {
    if (apiResults.length > 0) {
      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(apiResults));
      const downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "results.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } else {
      alert("ダウンロードする結果がありません。");
    }
  });

  // HTMLダウンロード
  htmlDownloadButton.addEventListener("click", () => {
    if (apiResults.length > 0) {
      const textData = apiResults
        .map((item) => {
          return `<div style="margin:0;padding:5px;font-size:12px;word-break: break-all;"><a href="${item.affiliateURL}" rel="sponsored" style="display:block;text-align:center;"><img src="${item.imageURL.large}"style="margin:0;padding:0;border:0;max-width:100%"><span style="display:block;margin:5px 0 0 0;padding:0;text-align:left;">${item.title}</span></a><p style="margin:5px 0 0 0;padding:0;color:#8c8c8c;font-size:10px;"></p></div>`;
        })
        .join("\n");

      const dataStr =
        "data:text/plain;charset=utf-8," + encodeURIComponent(textData);
      const downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "gachaItems.txt");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } else {
      alert("ダウンロードする結果がありません。");
    }
  });

  // タイトルのみダウンロード
  titleDownloadButton.addEventListener("click", () => {
    if (apiResults.length > 0) {
      const textData = apiResults
        .map((item) => {
          return item.title;
        })
        .join("\n");

      const dataStr =
        "data:text/plain;charset=utf-8," + encodeURIComponent(textData);
      const downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "wordCloud.txt");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } else {
      alert("ダウンロードする結果がありません。");
    }
  });
});


// チェックボックスの変更に応じてarticle_idを更新する関数-------------------------------------------------------------------------------
function updateArticleId() {
    const articleIdInput = document.getElementById("article_id");
    let Ids = [];
    // 女優検索
    const selectedActresses = document.querySelectorAll('input[name="selectedActresses"]:checked');
    // ジャンル検索
    const selectedGenres = document.querySelectorAll('input[name="selectedGenres"]:checked');

  const actressIds = Array.from(selectedActresses).map((actress) => actress.value);
  const genreIds = Array.from(selectedGenres).map((genre) => genre.value);
  console.log(actressIds);
  console.log(Ids);

  // 新しいactressIdsを既存のIDに追加
  Ids = Ids.concat(actressIds);
  Ids = Ids.concat(genreIds);
  articleIdInput.value = Ids.join(" ");
}

// サイト、サービス、フロア作成-------------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {
  const siteSelect = document.getElementById("site");
  const serviceSelect = document.getElementById("service");
  const floorSelect = document.getElementById("floor");

  // APIからデータを取得する関数
  async function fetchData() {
    const response = await fetch(
      `https://api.dmm.com/affiliate/v3/FloorList?api_id=${apiID}&affiliate_id=${affiliateID}&output=json`
    );
    const data = await response.json();
    return data.result.site;
  }

  // サイトオプションを作成
  function populateSiteOptions(sites) {
    sites.forEach((site) => {
      const option = document.createElement("option");
      option.value = site.code;
      option.textContent = site.name;
      siteSelect.appendChild(option);
    });
  }

  // サービスオプションを作成
  function populateServiceOptions(services) {
    serviceSelect.innerHTML = "";
    services.forEach((service) => {
      const option = document.createElement("option");
      option.value = service.code;
      option.textContent = service.name;
      serviceSelect.appendChild(option);
    });
  }

  // フロアオプションを作成
  function populateFloorOptions(floors) {
    floorSelect.innerHTML = "";
    floors.forEach((floor) => {
      const option = document.createElement("option");
      option.value = floor.code;
      option.textContent = floor.name;
      option.setAttribute("floor-id", floor.id); // 追加のデータ属性
      floorSelect.appendChild(option);
    });
  }

  // サイト選択時にサービスオプションを更新
  siteSelect.addEventListener("change", () => {
    const selectedSiteCode = siteSelect.value;
    const selectedSite = sites.find((site) => site.code === selectedSiteCode);
    if (selectedSite) {
      populateServiceOptions(selectedSite.service);
      populateFloorOptions(selectedSite.service[0].floor); // 初期フロアの設定
    }
  });

  // サービス選択時にフロアオプションを更新
  serviceSelect.addEventListener("change", () => {
    const selectedSiteCode = siteSelect.value;
    const selectedSite = sites.find((site) => site.code === selectedSiteCode);
    if (selectedSite) {
      const selectedServiceCode = serviceSelect.value;
      const selectedService = selectedSite.service.find(
        (service) => service.code === selectedServiceCode
      );
      if (selectedService) {
        populateFloorOptions(selectedService.floor);
      }
    }
  });

  // 初期データの設定
  const sites = await fetchData();
  populateSiteOptions(sites);
  populateServiceOptions(sites[1].service);
  populateFloorOptions(sites[1].service[0].floor);
//   setFloorIdToForm();
});


// フロアIDのセット---------------------------------------------------------------------------
// document.getElementById("floor").addEventListener("change", setFloorIdToForm);
function setFloorIdToForm() {
  const floorId = getSelectedFloorId();
  const genreSearchForm = document.getElementById("genreSearchForm");
  const floorIdInput = genreSearchForm.querySelector('input[name="floor_id"]');

  floorIdInput.value = floorId;
}

function getSelectedFloorId() {
  const floorSelect = document.getElementById("floor"); // プルダウンのIDを使用
  const selectedOption = floorSelect.options[floorSelect.selectedIndex];
  return selectedOption.getAttribute("floor-id");
}