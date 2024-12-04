const app = angular.module('AuthApp', []);

app.controller('AuthController', function ($scope, $http) {
  $scope.error = '';
  
  $scope.register = function () {
    $scope.error = ''; // Reset error message
    $http.post('http://localhost:5000/users/register', $scope.user)
      .then(response => {
        alert('Registration successful! Redirecting to login...');
        window.location.href = 'login.html';
      })
      .catch(error => {
        // Display error from server or generic error
        $scope.error = error.data?.error || 'An error occurred during registration.';
      });
  };

  $scope.login = function () {
    $http.post('http://localhost:5000/users/login', $scope.credentials)
      .then(response => {
        alert('Login successful!');
        // Redirect or perform post-login actions here
      })
      .catch(error => {
        $scope.error = error.data.error;
      });
  };

  $scope.changePassword = function () {
    $scope.error = ''; // Reset error message
    $http.post('http://localhost:5000/users/changepw', {
      email: $scope.credentials.email,
      newPassword: $scope.credentials.password
    })
    .then(response => {
      alert('Password changed successfully!');
      window.location.href = 'login.html';
      // Redirect or handle post-password change actions here
    })
    .catch(error => {
      $scope.error = error.data?.error || 'An error occurred while changing the password.';
    });
};

});
