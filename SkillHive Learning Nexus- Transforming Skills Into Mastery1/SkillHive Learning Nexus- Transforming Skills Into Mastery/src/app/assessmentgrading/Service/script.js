fetch('..Service/utils/mock.json')
  .then(response => response.json())
  .then(data => {
    const searchBar = document.querySelector('.search-bar');
    const resultContainer = document.querySelector('.assessment-cards');

    searchBar.addEventListener('input', function () {
      const searchText = searchBar.value.trim().toLowerCase();

      resultContainer.innerHTML = ''; // Clear previous results

      const filteredCourses = data.courses.filter(course =>
        course.name.toLowerCase().includes(searchText) ||
        course.id.toLowerCase().includes(searchText)
      );

      filteredCourses.forEach(course => {
        const courseElement = document.createElement('div');
        courseElement.classList.add('card');

        let statusClass = '';
        let statusText = '';

        switch (course.status.toLowerCase()) {
          case 'live':
            statusClass = 'live-dot';
            statusText = 'Live';
            break;
          case 'upcoming':
            statusClass = 'upcoming-dot';
            statusText = 'Upcoming';
            break;
          case 'ended':
            statusClass = 'ended-dot';
            statusText = 'Ended';
            break;
          default:
            statusClass = 'unknown-dot';
            statusText = 'Unknown';
        }
        courseElement.innerHTML = `
          <a href="python-for-beginners.html?id=${course.id}" style="text-decoration: none;">
            <div class="live-badge">
              <span class="${statusClass}"></span>
              <span class="live-text">${statusText}</span>
            </div>
            <div class="logo-container">
              <img src="${course.logo}" alt="${course.name}" class="logo">
            </div>
            <h3>${course.name}</h3>
            <p>Course ID: ${course.id}</p>
          </a>
        `;

        courseElement.addEventListener('click', function () {
          const coursePageUrl = `python-for-beginners.html?id=${course.id}`; 
          window.location.href = coursePageUrl; 
        });
        
        resultContainer.appendChild(courseElement);
      });

      if (filteredCourses.length === 0) {
        resultContainer.innerHTML = '<p>No courses found</p>';
      }
    });
  })
  .catch(error => console.error('Error loading JSON:', error));