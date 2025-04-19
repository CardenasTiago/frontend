// darkModeToggle.js
function toggleDarkMode() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'mytheme' ? 'mydarktheme' : 'mytheme';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  }
  
  // Aplica el tema guardado al cargar la página
  document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'mytheme';
    document.documentElement.setAttribute('data-theme', savedTheme);
  });
  