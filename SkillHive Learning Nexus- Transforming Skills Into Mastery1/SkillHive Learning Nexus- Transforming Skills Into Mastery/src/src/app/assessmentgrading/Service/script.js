fetch('../../Service/utils/mock.json')
  .then(response => response.json())
  .then(data => {
    const searchBar = document.querySelector('.search-bar');
    const resultContainer = document.querySelector('.assessment-cards');

    searchBar.addEventListener('input', function () {
      const searchText = searchBar.value.trim().toLowerCase();

      resultContainer.innerHTML = ''; 

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
            statusClass = 'live';
            statusText = 'Live';
            break;
          case 'upcoming':
            statusClass = 'upcoming';
            statusText = 'Upcoming';
            break;
          case 'ended':
            statusClass = 'ended';
            statusText = 'Ended';
            break;
          default:
            statusClass = 'unknown';
            statusText = 'Unknown';
        }

        function getCourseLink(course) {
          const courseLinks = {
              "P0001": "../Models/python-for-beginners.html",
              "P0011": "../Models/python-for-beginners2.html",
              "P0021": "../Models/python-for-beginners3.html",
              "J0001": "../Models/java-for-beginners.html",
              "S0001": "../Models/mysql-for-beginners.html",
              "P0002": "../Models/python-intermediate.html",
              "J0002": "../Models/java-intermediate.html",
              "S0002": "../Models/mysql-intermediate.html",
              "H0001": "../Models/html-oneshot.html",
              "C0001": "../Models/css-oneshot.html",
              "JS0001": "../Models/javascript-oneshot.html"
          };
          return courseLinks[course.id] || "../Models/default-course.html";
           }
      
        

        courseElement.innerHTML = `
        <a href="${getCourseLink(course)}" style="text-decoration: none;">
          <div class="${statusClass}-badge">
            <span class="${statusClass}-dot"></span>
            <span class="live-text">${statusText}</span>
          </div>
          <div class="logo-container">
            <img src="${course.logo}" alt="${course.name}" class="logo">
          </div>
          <h3>${course.name}</h3>
          <p>Course ID: ${course.id}</p>
        </a>
      `;
        
        resultContainer.appendChild(courseElement);
      });

      if (filteredCourses.length === 0) {
        resultContainer.innerHTML = '<p>No courses found</p>';
      }
    });
  })
  .catch(error => console.error('Error loading JSON:', error.message));
