 const storage = {
    updateSelectedCity : function(city)  {
        localStorage.setItem("selected_city", city)
    },
    getSelectedCity : function() {
        return localStorage.getItem("selected_city")
    },
    updateListCity : function(list_city) {
        localStorage.setItem("list_city", JSON.stringify( [...list_city] ) );
    },
    getListCity : function() {
        return JSON.parse(localStorage.getItem("list_city"));
    }
 };

 export { storage }