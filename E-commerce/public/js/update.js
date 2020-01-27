const form = document.querySelector('form');
const updateBtn = document.getElementById('Update');

updateBtn.addEventListener('click',(e) => {
    e.preventDefault();
    let id = form.id;
    let name = form.name.value;
    let desc = form.desc.value;
    let qty = form.qty.value;
    let price = form.price.value;

    $.ajax({
      method: "POST", url: "/updateQuery",data: {
        id:id,
        name: name,
        desc: desc,
        qty: qty,
        price: price,
      },
      success: function(data,status) {
        window.location.href = '/admin';
      }
    });
});
