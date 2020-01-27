const userId = document.querySelector('.userId').id;
const checkOutBtn = document.getElementById("checkout");
const alertDiv = document.getElementById('divElement');

let isOutOfStock = false;
let errors = [];

BtnSetUnset();

function BtnSetUnset() {
    isOutOfStock = false;
    let cartQty = document.getElementsByClassName('Qty');
    let dbQty = document.getElementsByClassName('dbQty');

    for (let i = 0, len = dbQty.length; i < len; i++) {
        if (Number(cartQty[i].innerText) > Number(dbQty[i].value)) {
            isOutOfStock = true;
            // console.log(Number(qtys[i].innerText) + " " + Number(dbQty[i].value));
            errors.push('OOS');
        } else {
            errors.push('OK');
        }
    }

    if (isOutOfStock || document.querySelector('.container').children.length === 0) {
        checkOutBtn.setAttribute('disabled', true);
    } else {
        checkOutBtn.removeAttribute('disabled');
    }
}

for (let i = 0; i < errors.length; i++) {
    if (errors[i].localeCompare('OOS') === 0) {
        document.getElementById(`${i}`).innerText = 'Out Of Stock';
        document.getElementById(`${i}`).style.color = 'red';
    }
}

// making the checkOutBtn work..considering all the cases...
checkOutBtn.addEventListener('click',(e) => {
    // let cartQty = document.getElementsByClassName('Qty').innerText;
    // let dbQty = document.getElementsByClassName('dbQty').value;
    $.ajax({
        method: "POST", url: "/checkout", data: {
            userId: userId,
        },
        success: function (data, status) {
            if (data.err == null) {
                window.location.href = '/thanks';
            } else {
                dangerAlert(data.err);
            }
        }
    })
});

document.querySelector('.flex-container').addEventListener('click', (e) => {
    if (e.target.classList.contains('Delete')) {
        // first adminProducts mein cartQty + hogi
        // then adminCart mein se ye row delete hogi
        // then page refresh hoga
        // done...........
        const productId = e.target.parentElement.parentElement.id;
        const pQty = (e.target.parentElement.previousElementSibling.previousElementSibling.firstElementChild.innerText);
        $.ajax({
            method: 'POST', url: '/user/deleteCartItem', data: {
                productId: productId,
                userId: userId,
                pQty: pQty,
            },
            success: function (data, status) {
                // after success request in database now deleting from Dom
                e.target.parentElement.parentElement.parentElement.remove();
                dangerAlert('Deleted');
                BtnSetUnset();
                wait = false;
            }
        });
    }
});

function dangerAlert(str) {
  alertDiv.style.display = 'block';
  alertDiv.firstElementChild.innerText = str;
  setTimeout(() => {
    alertDiv.style.display = 'none';
  },1000);
}
