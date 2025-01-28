// fetch('./JSON Server/db.json')
//   .then(response => {
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     return response.json();
//   })
//   .then(data => {
//     const searchBar = document.querySelector('.search-bar');
//     const resultContainer = document.querySelector('.assessment-cards');

//     // Function to get course link based on course ID
//     function getCourseLink(course) {
//       const courseLinks = {
//         "DS001": "../Models/data-science.html",
//         "BA001": "../Models/business-analytics.html"
//         // "WD001": "../Models/web-development.html",
//         // "GD001": "../Models/graphics-design.html",
//         // "DM001": "../Models/digital-marketing.html"
//       };
//       return courseLinks[course.id] || "../Models/default-course.html";
//     }

//     // Event listener for search functionality
//     searchBar.addEventListener('input', function () {
//       const searchText = searchBar.value.trim().toLowerCase();
//       resultContainer.innerHTML = ''; // Clear the container for new results

//       // Filter courses based on name or ID
//       const filteredCourses = data.courses.filter(course =>
//         course.name.toLowerCase().includes(searchText) ||
//         course.id.toLowerCase().includes(searchText)
//       );

//       // Display filtered courses
//       filteredCourses.forEach(course => {
//         const courseElement = document.createElement('div');
//         courseElement.classList.add('card');

//         // Determine status class and text
//         let statusClass = '';
//         let statusText = '';

//         switch (course.status.toLowerCase()) {
//           case 'live':
//             statusClass = 'live';
//             statusText = 'Live';
//             break;
//           case 'upcoming':
//             statusClass = 'upcoming';
//             statusText = 'Upcoming';
//             break;
//           case 'ended':
//             statusClass = 'ended';
//             statusText = 'Ended';
//             break;
//           default:
//             statusClass = 'unknown';
//             statusText = 'Unknown';
//         }

//         // Fallback for missing logo
//         const logoSrc = course.logo || '../../assets/default-logo.png';

//         // Create course card content
//         courseElement.innerHTML = `
//           <a href="${getCourseLink(course)}" style="text-decoration: none;">
//             <div class="${statusClass}-badge">
//               <span class="${statusClass}-dot"></span>
//               <span class="live-text">${statusText}</span>
//             </div>
//             <div class="logo-container">
//               <img src="${logoSrc}" alt="${course.name}" class="logo">
//             </div>
//             <h3>${course.name}</h3>
//             <p>Course ID: ${course.id}</p>
//           </a>
//         `;

//         resultContainer.appendChild(courseElement);
//       });

//       // Display message if no courses match the search
//       if (filteredCourses.length === 0) {
//         resultContainer.innerHTML = '<p>No courses found</p>';
//       }
//     });
//   })
//   .catch(error => console.error('Error loading JSON:', error.message));
