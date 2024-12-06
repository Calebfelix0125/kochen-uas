const app = angular.module("articleApp", []);

app.controller("ArticleController", function ($scope, $http) {
  const API_URL = "http://localhost:3000/articles"; // Ganti dengan URL API Anda

  $scope.articles = [];
  $scope.article = {};
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

  // Save or update article
  $scope.saveArticle = function () {
    if ($scope.isEdit) {
      // Update existing article
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
      // Create new article
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

  // Open modal for adding a new article
  $scope.openFormModal = function () {
    $scope.isEdit = false;
    $scope.article = {};
    const modal = new bootstrap.Modal(document.getElementById("articleModal"));
    modal.show();
  };

  // Open modal for editing an article
  $scope.openArticleModal = function (article) {
    $scope.isEdit = true;
    $scope.article = angular.copy(article);
    const modal = new bootstrap.Modal(document.getElementById("articleModal"));
    modal.show();
  };

  // Delete article
  $scope.deleteArticle = function (id) {
    if (confirm("Are you sure you want to delete this article?")) {
      $http.delete(`${API_URL}/${id}`).then(
        () => {
          $scope.getArticles();
        },
        (error) => {
          console.error("Error deleting article:", error);
        }
      );
    }
  };

  // Open modal for Read More
  $scope.openReadMoreModal = function (article) {
    $scope.article = article;
    const modal = new bootstrap.Modal(document.getElementById("readMoreModal"));
    modal.show();
  };

  // Reset form
  $scope.resetForm = function () {
    $scope.article = {};
    $scope.isEdit = false;
  };

  // Initialize articles
  $scope.getArticles();
});
