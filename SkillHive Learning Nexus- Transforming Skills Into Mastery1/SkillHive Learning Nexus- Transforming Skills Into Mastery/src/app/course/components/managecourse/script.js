function filterCourses() {
    const select = document.getElementById('filter-status');
    const selectedValue = select.value;
    const rows = document.querySelectorAll('#course-table-body tr');

    rows.forEach(row => {
        const status = row.getAttribute('data-status');
        if (selectedValue === '' || status === selectedValue) {
            row.style.display = ''; // Show row
        } else {
            row.style.display = 'none'; // Hide row
        }
    });
}