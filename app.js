import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getFirestore, doc, getDocs, collection, getDoc, setDoc, updateDoc, deleteField } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { getStorage , ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyAJqWuUrPb6QX64oKXubUY3bTEUiaQWMqA",
    authDomain: "tradebazaar-6847e.firebaseapp.com",
    projectId: "tradebazaar-6847e",
    storageBucket: "tradebazaar-6847e.appspot.com",
    messagingSenderId: "1061667426313",
    appId: "1:1061667426313:web:9da56d5684803d1d72a8d8",
    measurementId: "G-F9C56SMKXT"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

    document.getElementById('mainLoader').style.display = 'flex';
    document.getElementById('main').style.display = 'none';
    document.getElementById('exploreSection').style.display = 'none';



loadAllData()
async function loadAllData(){
    let i=0
    AllData(); 
setInterval(function () {
    if(i==5){
  document.getElementById('main').style.display='block'
document.getElementById('mainLoader').style.display='none' 
  }
    i++;
}, 1000);

}


async function AllData() {
    document.getElementById('categoryType').innerText = "All Categories";
    document.getElementById('productRow').innerHTML='';
    const querySnapshot = await getDocs(collection(db, "All Products"));
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        for (let i = 0; i < 100; i++) {
            const productKey = `Product${i}`;
            if (data[productKey]) {
                const product = data[productKey];
                const imageUrl = product[3];
                const productName = product[0];
                const productDescription = product[6];

                document.getElementById('productRow').innerHTML += `
                    <div class="col-md-4">
                        <div class="card">
                            <img class="card-img-top" src="${imageUrl}" alt="Card image cap">
                            <div class="card-body">
                                <h5 class="card-title">${productName}</h5>
                                <p>Rs.${product[1]}</p>
                                <p class="card-text">${productDescription}</p>
                                <a onclick="explore('${productKey}', '${product[7]}')" class="btn btn-primary">Explore</a>
                            </div>
                        </div>
                    </div>
                `;
            }
        }
    });
}

async function loadCategoryData(category) {
     document.getElementById('main').style.display='block'
document.getElementById('exploreSection').style.display='none'
    document.getElementById('categoryType').innerText = category;
    document.getElementById('productRow').innerHTML = '';
    const querySnapshot = await getDocs(collection(db, "All Products"));
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        for (let i = 0; i < 100; i++) {
            const productKey = `Product${i}`;
            if (data[productKey]) {
                const product = data[productKey];
                if (product[5] === category) {
                    document.getElementById('productRow').innerHTML += `
                        <div class="col-md-4">
                            <div class="card">
                                <img class="card-img-top" src="${product[3]}" alt="Card image cap">
                                <div class="card-body">
                                    <h5 class="card-title">${product[0]}</h5>
                                    <p class="card-text">${product[6]}</p>
                                <a onclick="explore('${productKey}', '${product[7]}')" class="btn btn-primary">Explore</a>
                                </div>
                            </div>
                        </div>
                    `;
                }
            }
        }
    });
}
async function search(event) {
    if (event) {
        event.preventDefault();
    }
    document.getElementById('main').style.display = 'block';
    document.getElementById('exploreSection').style.display = 'none';
    let searchInput = document.getElementById('searchInput').value.toLowerCase();
    document.getElementById('categoryType').innerText = `Search results for ${searchInput}`;
    document.getElementById('productRow').innerHTML = '';

    try {
        const querySnapshot = await getDocs(collection(db, "All Products"));

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            for (let i = 0; i < 100; i++) {
                const productKey = `Product${i}`;
                if (data[productKey]) {
                    const product = data[productKey];
                    if (product[0].toLowerCase().includes(searchInput)) {
                        document.getElementById('productRow').innerHTML += `
                            <div class="col-md-4">
                                <div class="card">
                                    <img class="card-img-top" src="${product[3]}" alt="Card image cap">
                                    <div class="card-body">
                                        <h5 class="card-title">${product[0]}</h5>
                                        <p class="card-text">${product[6]}</p>
                                        <a onclick="explore('${productKey}', '${product[7]}')" class="btn btn-primary">Explore</a>
                                    </div>
                                </div>
                            </div>
                        `;
                    }
                }
            }
        });
    } catch (error) {
        console.error("Error fetching documents: ", error);
    }
    document.getElementById('searchInput').value = '';
}

async function showSellModal(){

}
async function submitNewPrdForm() {
    var productName = document.getElementById('prdName').value.trim();
    var productPrice = document.getElementById('prdPrice').value.trim();
    var productDescription = document.getElementById('prdDes').value.trim();
    var sellerName = document.getElementById('sellerName').value.trim();
    var category = document.getElementById('categoryDropDown').value;
    let file=document.getElementById('prdImage')
    var errorElement = document.getElementById('err');
    const date = new Date();
    let URL;

    if (!productName) {
        errorElement.innerText = "Please enter the product name.";
        return;
    } else if (!productPrice) {
        errorElement.innerText = "Please enter the product price.";
        return;
    } else if (!productDescription) {
        errorElement.innerText = "Please enter the product description.";
        return;
    } else if (!sellerName) {
        errorElement.innerText = "Please enter the seller name.";
        return;
    } else if (category === "Select Category") {
        errorElement.innerText = "Please select a category.";
        return;
    }else if(file==null){
        errorElement.innerText = "Please enter product image.";
        return;
    }
    errorElement.innerText = "";
    const docRef = doc(db, "All Products", localStorage.getItem("Email"));
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        for (let i = 1; i < 100; i++) {
            let temp = docSnap.data()[`Product${i}`];
            if (!temp) {
const storageRef = ref(storage, `${file.files[0].name}`);
const uploadTask = uploadBytesResumable(storageRef, file.files[0]);
uploadTask.on('state_changed', 
(snapshot) => {
const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
console.log('Upload is ' + progress + '% done');
loader(progress)
switch (snapshot.state) {
case 'paused':
console.log('Upload is paused');
break;
case 'running':
console.log('Upload is running');
break;
}
}, 
(error) => {
console.log(error) 
loader(0)
}, 
() => {
getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
URL=downloadURL;
const productKey = `Product${i}`;
const productData = [
    productName,
    productPrice,
    sellerName,
    URL,
    date,
    category,
    productDescription,
    localStorage.getItem("Email")
];
await setDoc(docRef, {
    [productKey]: productData
}, { merge: true });
window.location.href="main.html"
});
}
);
break;
            }
        }
    }else{
const storageRef = ref(storage, `${file.files[0].name}`);
const uploadTask = uploadBytesResumable(storageRef, file.files[0]);
uploadTask.on('state_changed', 
(snapshot) => {
const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
console.log('Upload is ' + progress + '% done');
switch (snapshot.state) {
case 'paused':
console.log('Upload is paused');
break;
case 'running':
console.log('Upload is running');
break;
}
}, 
(error) => {
console.log(error)  }, 
() => {
getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
URL=downloadURL;
await setDoc(doc(db, "All Products", localStorage.getItem("Email")), {
    Product1: [
        productName,
        productPrice,
        sellerName,
        URL,
        date,
        category,
        productDescription,
        localStorage.getItem("Email")
    ]
});   
window.location.href="main.html"
});
}
);
         
    }
}
document.getElementById('sellNew').style.backgroundColor="#007bff";

async function yourPrd(){
document.getElementById('sellNew').style.backgroundColor="white";
document.getElementById('soldBtn').style.backgroundColor="white";
document.getElementById('yourProducts').style.backgroundColor="#007bff";
document.getElementById('sellNewBody').style.display="none";
const docRef = doc(db, "All Products", localStorage.getItem("Email"));
const docSnap = await getDoc(docRef);
if (docSnap.exists()) {
    const data = docSnap.data();
    for (let i = 0; i < 100; i++) {
        const productKey = `Product${i}`;
        if (data[productKey]) {
            const product = data[productKey];
            const imageUrl = product[3];
            const productName = product[0];
            const productDescription = product[6];

            document.getElementById('yourPrdBody').innerHTML += `
                <div class="col-md-4">
                    <div class="card">
                        <img class="card-img-top" src="${imageUrl}" alt="Card image cap">
                      <h4>${product[5]}</h4>
                        <div class="card-body">
                            <h5 class="card-title">${productName}</h5>
                            <h6>${product[4]}</h6>
                            <p class="card-text">${productDescription}</p>
                            <a onclick="del('${productKey}')" style="background-color:red;" class="btn">Delete</a>
                        </div>
                    </div>
                </div>
            `;
        }
    }

}else{
    document.getElementById('yourPrdBody').innerHTML='<br><br><br><br><h3>No Product Found</h3><br><br><br>'
}
}


async function sellNew(){
    document.getElementById('sellNew').style.backgroundColor="#007bff";
    document.getElementById('soldBtn').style.backgroundColor="white";
    document.getElementById('yourProducts').style.backgroundColor="white";
    document.getElementById('sellNewBody').style.display="flex";
    document.getElementById('yourPrdBody').style.display="none";


    }

    async function allSold(){
        document.getElementById('sellNew').style.backgroundColor="white";
        document.getElementById('soldBtn').style.backgroundColor="#007bff";
        document.getElementById('yourProducts').style.backgroundColor="white";
        document.getElementById('sellNewBody').style.display="none";
        document.getElementById('yourPrdBody').style.display="none";

        }
        loader(0)
        function loader(value){
            document.getElementById('loader').style.width=`${value}%`
        }



async function del(prd){
        const cityRef = doc(db, 'All Products', localStorage.getItem('Email'));
await updateDoc(cityRef, {
    [`${prd}`]: deleteField()
});
window.location.href="main.html"
}

async function buy(prd,email){
    const cityRef = doc(db, 'All Products', email);
await updateDoc(cityRef, {
[`${prd}`]: deleteField()
});
alert("Purchased")
loadAllData()
loadAllData()
loadAllData()
}


async function explore(prd,mail){
document.getElementById('main').style.display='none'
document.getElementById('exploreSection').style.display='block'
const docRef = doc(db, "All Products", mail);
const docSnap = await getDoc(docRef);
const data = docSnap.data();
const product = data[prd];
let datee=convertTimestampToDate(product[4])
document.getElementById('imgContainer').innerHTML=`<img style="width:inherit;" src=${product[3]}></img>`
document.getElementById('prdName').innerText=`${product[0]}`
document.getElementById('prdPrice').innerHTML=`<h5>Rs.${product[1]}</h5><br><button style="
    background-color: #28a745;
    color: white;
    border-radius: 25px;
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    cursor: pointer;
    font-weight: bold;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s, transform 0.2s;
" onclick="buy('${prd}','${mail}')"
    onmouseover="this.style.backgroundColor='#218838'; this.style.transform='scale(1.05)';"
    onmouseout="this.style.backgroundColor='#28a745'; this.style.transform='scale(1)';">
    Buy Now
</button>
`
document.getElementById('prdDes').innerHTML=`
<label><b>Description:</b></label><p>${product[6]}</p>
<label><b>Categary:</b></label><p>${product[5]}</p>
<label><b>Contact User:</b></label>
<p>Name:${product[5]}</p>
<p>Email:${product[7]}</p>
<br><br>
<label>Uploaded on:</label><p>${datee}</p>
`


loadMorePrd(mail)


}
function convertTimestampToDate(timestamp) {
    let date = new Date(timestamp * 1000);

    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    let day = String(date.getDate()).padStart(2, '0');
    let hours = String(date.getHours()).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');
    let seconds = String(date.getSeconds()).padStart(2, '0');

    // Return the formatted date string
    return `${month}-${day} ${hours}:${minutes}`;
}


async function loadMorePrd(mail){
    const docRef = doc(db, "All Products", mail);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        for (let i = 0; i < 100; i++) {
            const productKey = `Product${i}`;
            if (data[productKey]) {
                const product = data[productKey];
                const imageUrl = product[3];
                const productName = product[0];
                const productDescription = product[6];
    
                document.getElementById('morePrd').innerHTML += `
                    <div class="col-md-4">
                        <div class="card">
                            <img class="card-img-top" src="${imageUrl}" alt="Card image cap">
                          <h4>${product[5]}</h4>
                            <div class="card-body">
                                <h5 class="card-title">${productName}</h5>
                                <h6>${product[4]}</h6>
                                <p class="card-text">${productDescription}</p>
                                <a onclick="explore('${productKey}', '${product[7]}')" class="btn btn-primary">Explore</a>
                            </div>
                        </div>
                    </div>
                `;
            }
        }
    }
}


window.showSellModal=showSellModal
window.loadCategoryData = loadCategoryData;
window.search = search;
window.submitNewPrdForm=submitNewPrdForm;
window.yourPrd=yourPrd;
window.sellNew=sellNew;
window.allSold=allSold;
window.del=del;
window.explore=explore;
window.buy=buy;

