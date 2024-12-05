const app = angular.module('RecipeApp', ['ngCookies']); 

app.controller('RecipeController', function ($scope, $http, $cookies) {
    $scope.recipes = [];
    $scope.currentRecipe = {};
    $scope.editMode = false;

    $scope.loadRecipes = function () {
        $http.get('http://localhost:3000/recipes/lists')
            .then(response => {
                $scope.recipes = response.data;
            })
            .catch(error => {
                console.error('Error loading recipes:', error);
            });
    };

    $scope.saveRecipe = function () {
        const token = $cookies.get('authToken'); 

        if (!token) {
            alert('User not authenticated!');
            return;
        }

        const recipeData = {
            title: $scope.currentRecipe.title,
            description: $scope.currentRecipe.description,
            ingredients: $scope.currentRecipe.ingredients.split(','),
            instructions: $scope.currentRecipe.instructions,
            author: $scope.userId, 
        };

        if ($scope.editMode) {
            $http.put(`http://localhost:3000/recipes/${$scope.currentRecipe._id}`, recipeData, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(response => {
                alert('Recipe updated successfully!');
                $scope.loadRecipes();
                const modal = bootstrap.Modal.getInstance(document.getElementById('addRecipeModal'));
                modal.hide();
            })
            .catch(error => {
                console.error('Error updating recipe:', error);
                alert('Failed to update recipe.');
            });
        } else {
            $http.post('http://localhost:3000/recipes/add', recipeData, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(response => {
                alert('Recipe added successfully!');
                $scope.loadRecipes();
                const modal = bootstrap.Modal.getInstance(document.getElementById('addRecipeModal'));
                modal.hide();
            })
            .catch(error => {
                console.error('Error adding recipe:', error);
                alert('Failed to add recipe.');
            });
        }

        $scope.currentRecipe = {};
        $scope.editMode = false;
    };

    // Edit Recipe
    $scope.editRecipe = function (recipe) {
        $scope.currentRecipe = angular.copy(recipe);
        $scope.editMode = true;
        const modal = new bootstrap.Modal(document.getElementById('addRecipeModal'));
        modal.show();
    };

    // Delete Recipe
    $scope.deleteRecipe = function (id) {
        const token = $cookies.get('authToken'); 

        if (!token) {
            alert('User not authenticated!');
            return;
        }

        $http.delete(`http://localhost:3000/recipes/delete/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => {
            alert('Recipe deleted successfully!');
            $scope.loadRecipes();
        })
        .catch(error => {
            console.error('Error deleting recipe:', error);
            alert('Failed to delete recipe.');
        });
    };

    // Initialize
    $scope.loadRecipes();
});
