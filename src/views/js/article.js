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

  // Edit article
  $scope.editArticle = function (item) {
    $scope.isEdit = true;
    $scope.article = angular.copy(item); // Copy article data to form
    // Open the modal programmatically
    $("#articleModal").modal("show");
  };

  // Save article
  $scope.saveArticle = function () {
    const formData = new FormData();
    formData.append("title", $scope.article.title);
    formData.append("content", $scope.article.content);
    formData.append("author", $scope.article.author);
    if ($scope.article.image) {
      formData.append("image", $scope.article.image);
    }

    if ($scope.isEdit) {
      $http
        .put(`${API_URL}/${$scope.article._id}`, formData, {
          headers: { "Content-Type": undefined },
        })
        .then(
          () => {
            $scope.getArticles();
            $scope.resetForm();
          },
          (error) => {
            console.error("Error updating article:", error);
          }
        );
    } else {
      $http
        .post(API_URL, formData, {
          headers: { "Content-Type": undefined },
        })
        .then(
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

$scope.isSearching = false;

$scope.$watch("searchQuery", function (newValue) {
  if (newValue) {
    $scope.isSearching = true;
    // Simulasi waktu pencarian (misal, 500ms)
    $timeout(function () {
      $scope.isSearching = false;
    }, 500);
  } else {
    $scope.isSearching = false;
  }
});

app.directive("fileModel", [
  "$parse",
  function ($parse) {
    return {
      restrict: "A",
      link: function (scope, element, attrs) {
        const model = $parse(attrs.fileModel);
        const modelSetter = model.assign;

        element.bind("change", function () {
          scope.$apply(function () {
            modelSetter(scope, element[0].files[0]);
          });
        });
      },
    };
  },
]);
