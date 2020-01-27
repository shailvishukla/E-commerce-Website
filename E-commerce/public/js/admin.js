let parentContainer = document.querySelector('.flex-container');

parentContainer.addEventListener("click", (e) => {
  if(e.target.classList.contains("Delete")){
    let id = e.target.parentElement.parentElement.id;
    e.target.parentElement.parentElement.remove();

    $.ajax({
      method: "POST", url: "/admin/delete" ,data: {"id":id}
    });
  }
  if(e.target.classList.contains("Edit")){
    let id = e.target.parentElement.parentElement.id;
    let productInfo = e.target.parentElement.previousElementSibling.children;
    let name = productInfo[0].innerText;
    let desc = productInfo[1].innerText;
    let qty = Number(productInfo[2].innerText.substring(4,productInfo[2].innerText.length));
    let price = Number(productInfo[3].innerText.substring(7,productInfo[3].innerText.length));

    $.ajax({
      method: "POST", url: "/admin/update", data: {
        id:id,
        name: name,
        desc: desc,
        qty: qty,
        price: price,
      },
      success: function(data,status) {
        window.location.href = '/update';
      }
    });
    // window.location.href = '/update';
  }
})
