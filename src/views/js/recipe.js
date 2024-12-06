const app = angular.module("RecipeApp", ["ngCookies"]);

app.controller("RecipeController", function ($scope, $http, $cookies) {
  $scope.recipes = [];
  $scope.currentRecipe = {};
  $scope.editMode = false;

  $scope.loadRecipes = function () {
    $http
      .get("http://localhost:3000/recipes/lists")
      .then((response) => {
        $scope.recipes = response.data;
      })
      .catch((error) => {
        console.error("Error loading recipes:", error);
      });
  };

  $scope.saveRecipe = function () {
    const token = $cookies.get("authToken");

    if (!token) {
      alert("User not authenticated!");
      return;
    }

    const formData = new FormData();
    formData.append("title", $scope.currentRecipe.title);
    formData.append("description", $scope.currentRecipe.description);
    formData.append("ingredients", $scope.currentRecipe.ingredients);
    formData.append("instructions", $scope.currentRecipe.instructions);

    if ($scope.currentRecipe.photo) {
      formData.append("photo", $scope.currentRecipe.photo);
    }

    const url = $scope.editMode
      ? `http://localhost:3000/recipes/${$scope.currentRecipe._id}`
      : "http://localhost:3000/recipes/add";

    const method = $scope.editMode ? "PUT" : "POST";

    $http({
      method: method,
      url: url,
      data: formData,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": undefined, // Let the browser set the Content-Type
      },
    })
      .then((response) => {
        alert(
          `${$scope.editMode ? "Recipe updated" : "Recipe added"} successfully!`
        );
        $scope.loadRecipes();
      })
      .catch((error) => {
        console.error("Error saving recipe:", error);
        alert("Failed to save recipe.");
      });
  };

  // Edit Recipe
  $scope.editRecipe = function (recipe) {
    $scope.currentRecipe = angular.copy(recipe);
    $scope.editMode = true;
    const modal = new bootstrap.Modal(
      document.getElementById("addRecipeModal")
    );
    modal.show();
  };

  // Delete Recipe
  $scope.deleteRecipe = function (id) {
    const token = $cookies.get("authToken");

    if (!token) {
      alert("User not authenticated!");
      return;
    }

    $http
      .delete(`http://localhost:3000/recipes/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        alert("Recipe deleted successfully!");
        $scope.loadRecipes();
      })
      .catch((error) => {
        console.error("Error deleting recipe:", error);
        alert("Failed to delete recipe.");
      });
  };

  $scope.selectedRecipe = {};

  $scope.viewRecipeDetails = function (recipe) {
    $scope.selectedRecipe = angular.copy(recipe);
    const modal = new bootstrap.Modal(
      document.getElementById("viewRecipeModal")
    );
    modal.show();
  };

  // Initialize
  $scope.loadRecipes();
});

app.directive("fileInput", function () {
  return {
    scope: {
      fileInput: "=",
    },
    link: function (scope, element) {
      element.bind("change", function (event) {
        scope.$apply(function () {
          scope.fileInput = event.target.files[0];
        });
      });
    },
  };
});
