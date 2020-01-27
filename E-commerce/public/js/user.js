const parentContainer = document.querySelector(".flex-container");
const userId = document.querySelector('.user').id;
const inputQty = document.querySelector('.cartCheck');
const alertDiv = document.getElementById('divElement');

parentContainer.addEventListener("click", (e) => {
  if(e.target.classList.contains("addToCart")){
    let productId = e.target.parentElement.parentElement.parentElement.parentElement.id;
    let pName = e.target.parentElement.parentElement.parentElement.previousElementSibling.firstElementChild.innerText;
    let pPrice = parseInt(e.target.parentElement.parentElement.parentElement.previousElementSibling.lastElementChild.firstElementChild.innerText);
    let pQty = parseInt(e.target.parentElement.previousElementSibling.value);
    console.log(pPrice);
    if(isNaN(pQty)) {
      inputQty.classList.add('border-danger');
    } else {
      $.ajax({
        method: "POST", url: "/user/addProduct", data : {
          "userId": userId,
          "productId": productId,
          "pName": pName,
          "pPrice": pPrice,
          "pQty": pQty,
        },
        success: function(data,status) {
          addedAlert('Added');
        }
      })
      inputQty.classList.remove('border-danger');
    }
  }
})

function addedAlert(str) {
  alertDiv.style.display = 'block';
  alertDiv.firstElementChild.innerText = str;
  setTimeout(() => {
    alertDiv.style.display = 'none';
  },1000);
}

parentContainer.addEventListener("keyup",(e) =>{
  if(e.target.classList.contains("cartCheck")){
    let qty = parseInt(e.target.value);
    let maxQty = parseInt(e.target.max);
    if(!isNaN(qty)){
      let cartBtn = e.target.nextElementSibling.firstElementChild;
      if(qty <= 0) {
        cartBtn.setAttribute('disabled',true);
        cartBtn.style.cursor = 'not-allowed';
        inputQty.classList.remove('border-danger');
      } else {
        cartBtn.removeAttribute('disabled');
        cartBtn.style.cursor = 'pointer';
        inputQty.classList.remove('border-danger');
      }
      // else if(qty > maxQty) {
      //   cartBtn.classList.remove('bg-success');
      //   cartBtn.classList.add('bg-danger');
      //   cartBtn.innerText = 'Out Of Stock';
      //   cartBtn.style.cursor = 'not-allowed';
      //   cartBtn.setAttribute('disabled',true);
      // } else {
      //   cartBtn.classList.remove('bg-danger');
      //   cartBtn.classList.add('bg-success');
      //   cartBtn.innerText = 'Add';
      //   cartBtn.style.cursor = 'pointer';
      //   cartBtn.removeAttribute('disabled');
      // }
    }
  }
})
