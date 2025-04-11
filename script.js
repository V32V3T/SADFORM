document.addEventListener('DOMContentLoaded', () => {
    const namkeenData = [
        { id: 'heeramoti', name: 'Heera Moti Sev', rate: 190 },
        { id: 'shahimoti', name: 'Shahi Moti Sev', rate: 200 },
        { id: 'crispygold', name: 'Crispy Gold', rate: 190 },
        { id: 'zaykabarik', name: 'Zayka Barik', rate: 200 },
        { id: 'desichatpata', name: 'Desi Chatpata Mix', rate: 190 },
        { id: 'royalnamkeen', name: 'Royal Namkeen Mix', rate: 200 },
        { id: 'tanabana', name: 'Tana Bana Sev', rate: 190 },
        { id: 'shehzaadi', name: 'Shehzaadi Sev', rate: 200 }
    ];

    const namkeenListContainer = document.getElementById('namkeen-list');
    const totalAmountSpan = document.getElementById('total-amount');
    const orderForm = document.getElementById('order-form');
    const summaryModal = document.getElementById('summary-modal');
    const summaryDetailsContainer = document.getElementById('summary-details');
    const closeButton = document.querySelector('.close-button');
    const confirmOrderButton = document.getElementById('confirm-order');

    function createNamkeenTable() {
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        // Table Header
        thead.innerHTML = `
            <tr>
                <th>Select</th>
                <th>Namkeen</th>
                <th>Rate/KG (₹)</th>
                <th>Quantity (KG)</th>
                <th>Total (₹)</th>
            </tr>
        `;
        table.appendChild(thead);

        // Table Body - Populate with namkeen items
        namkeenData.forEach(item => {
            const row = document.createElement('tr');
            row.dataset.itemId = item.id;
            row.innerHTML = `
                <td><input type="checkbox" class="item-select" data-id="${item.id}"></td>
                <td>${item.name}</td>
                <td>${item.rate.toFixed(2)}</td>
                <td><input type="number" class="item-quantity" data-id="${item.id}" value="1" min="0.5" max="99" step="0.5" disabled></td>
                <td class="item-total">0.00</td>
            `;
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        namkeenListContainer.appendChild(table);
    }

    function calculateTotal() {
        let grandTotal = 0;
        const rows = namkeenListContainer.querySelectorAll('tbody tr');

        rows.forEach(row => {
            const checkbox = row.querySelector('.item-select');
            const quantityInput = row.querySelector('.item-quantity');
            const itemTotalCell = row.querySelector('.item-total');
            const itemId = row.dataset.itemId;
            const itemData = namkeenData.find(i => i.id === itemId);

            if (checkbox.checked) {
                quantityInput.disabled = false;
                const quantity = parseFloat(quantityInput.value) || 0;
                 // Basic validation for quantity
                if (quantity < 0.5) quantityInput.value = 0.5;
                if (quantity > 99) quantityInput.value = 99;

                const itemTotal = itemData.rate * quantity;
                itemTotalCell.textContent = itemTotal.toFixed(2);
                grandTotal += itemTotal;
            } else {
                quantityInput.disabled = true;
                // Optionally reset quantity when unchecked
                // quantityInput.value = 1; 
                itemTotalCell.textContent = '0.00';
            }
        });

        totalAmountSpan.textContent = grandTotal.toFixed(2);
    }

    function validateForm() {
        const fullName = document.getElementById('fullName').value.trim();
        const phone = document.getElementById('phone');
        const pincode = document.getElementById('pincode');
        let isValid = true;
        let errorMessage = "Please fix the following issues:\n";

        if (!fullName) {
            isValid = false;
            errorMessage += "- Full Name is required.\n";
            document.getElementById('fullName').classList.add('invalid');
        } else {
             document.getElementById('fullName').classList.remove('invalid');
        }

        if (!phone.checkValidity()) {
            isValid = false;
            errorMessage += "- Please enter a valid 10-digit Indian Phone Number.\n";
             phone.classList.add('invalid');
        } else {
             phone.classList.remove('invalid');
        }
        
        // Pincode validation (optional field, but validate if entered)
        if (pincode.value && !/^[0-9]{6}$/.test(pincode.value)) {
            isValid = false;
            errorMessage += "- Please enter a valid 6-digit Pincode.\n";
            pincode.classList.add('invalid');
        } else {
             pincode.classList.remove('invalid');
        }

        // Check if at least one namkeen is selected
        const anySelected = Array.from(document.querySelectorAll('.item-select')).some(cb => cb.checked);
        if (!anySelected) {
             isValid = false;
             errorMessage += "- Please select at least one Namkeen item.\n";
        }

        if (!isValid && errorMessage !== "Please fix the following issues:\n") {
            alert(errorMessage);
        }

        return isValid;
    }

    function generateOrderSummary() {
        const formData = new FormData(orderForm);
        let summaryHTML = `<p><strong>Full Name:</strong> ${formData.get('fullName')}</p>`;
        summaryHTML += `<p><strong>Phone Number:</strong> ${formData.get('phone')}</p>`;
        summaryHTML += `<p><strong>Address:</strong> ${formData.get('houseNo') || ''} ${formData.get('area') || ''}, ${formData.get('city') || ''} - ${formData.get('pincode') || ''}</p>`;

        summaryHTML += '<h3>Selected Namkeen:</h3><ul>';
        let itemsSelected = false;
        namkeenData.forEach(item => {
            const checkbox = document.querySelector(`.item-select[data-id="${item.id}"]`);
            if (checkbox.checked) {
                itemsSelected = true;
                const quantityInput = document.querySelector(`.item-quantity[data-id="${item.id}"]`);
                const quantity = parseFloat(quantityInput.value);
                const itemTotal = item.rate * quantity;
                summaryHTML += `<li>${item.name}: ${quantity} KG @ ₹${item.rate.toFixed(2)}/KG = ₹${itemTotal.toFixed(2)}</li>`;
            }
        });
         if (!itemsSelected) summaryHTML += '<li>No items selected.</li>';
        summaryHTML += '</ul>';

        summaryHTML += `<p><strong>Total Amount:</strong> ₹${totalAmountSpan.textContent}</p>`;
        summaryHTML += `<p><strong>Special Instructions:</strong> ${formData.get('instructions') || 'None'}</p>`;
        summaryHTML += `<p><strong>Payment Method:</strong> ${formData.get('paymentMethod')}</p>`;

        summaryDetailsContainer.innerHTML = summaryHTML;
    }

    // --- Event Listeners ---

    // Recalculate on checkbox or quantity change
    namkeenListContainer.addEventListener('change', (event) => {
        if (event.target.classList.contains('item-select') || event.target.classList.contains('item-quantity')) {
            calculateTotal();
        }
    });

    // Form submission
    orderForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent actual form submission
        if (validateForm()) {
            generateOrderSummary();
            summaryModal.style.display = 'block'; // Show modal
        }
    });

    // Modal close button
    closeButton.addEventListener('click', () => {
        summaryModal.style.display = 'none';
    });

    // Close modal if clicked outside the content area
    window.addEventListener('click', (event) => {
        if (event.target == summaryModal) {
            summaryModal.style.display = 'none';
        }
    });

     // Confirm Order button (for now, just closes modal)
    confirmOrderButton.addEventListener('click', () => {
        console.log('Order confirmed (simulation)');
        // In a real application, you would send the data to a server here.
        summaryModal.style.display = 'none';
        alert('Order Placed Successfully! (Simulation)');
        // Optionally reset the form
        // orderForm.reset();
        // calculateTotal(); // Recalculate to reset totals
    });


    // --- Initial Setup ---
    createNamkeenTable(); // Populate the list on page load
    calculateTotal(); // Calculate initial total (should be 0)

}); 