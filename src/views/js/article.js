const app = angular.module("articleApp", []);

app.controller("ArticleController", function ($scope, $http) {
  const API_URL = "http://localhost:3000/articles";

  $scope.articles = [];
  $scope.article = {};
  $scope.selectedArticle = {};
  $scope.isEdit = false;

  // Fetch all articles
  $scope.getArticles = function () {
    $http.get(API_URL).then(
      (response) => {
        $scope.articles = response.data;
      },
      (error) => {
        console.error("Error fetching articles:", error);
      }
    );
  };

  // Save article
  $scope.saveArticle = function () {
    if ($scope.isEdit) {
      // Update article
      $http.put(`${API_URL}/${$scope.article._id}`, $scope.article).then(
        () => {
          $scope.getArticles();
          $scope.resetForm();
        },
        (error) => {
          console.error("Error updating article:", error);
        }
      );
    } else {
      // Create article
      $http.post(API_URL, $scope.article).then(
        () => {
          $scope.getArticles();
          $scope.resetForm();
        },
        (error) => {
          console.error("Error creating article:", error);
        }
      );
    }
  };

  // Edit article
  $scope.editArticle = function (item) {
    $scope.isEdit = true;
    $scope.article = angular.copy(item); // Copy article data to form
  };

  // Confirm delete
  $scope.confirmDelete = function (item) {
    $scope.selectedArticle = item;
  };

  // Delete article
  $scope.deleteArticle = function (id) {
    $http.delete(`${API_URL}/${id}`).then(
      () => {
        $scope.getArticles();
      },
      (error) => {
        console.error("Error deleting article:", error);
      }
    );
  };

  // Reset form
  $scope.resetForm = function () {
    $scope.article = {};
    $scope.isEdit = false;
  };

  // Initialize articles
  $scope.getArticles();
});
