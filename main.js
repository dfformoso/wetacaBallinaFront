 var app = new Vue({
    el: '#app',
    data: {
      dishes: null,
      categories: null,
      users: {},
      userSelected: null,
      order: {}
    },


    methods: {
      dividePrice(price) {
        return price/100;
      },

      addMeal(dish, userName){
        userName=userName;
        price=dish.price;
        link="https://wetaca.com/carta/"+dish.category.slug+"/"+dish.slug;
        dishName=dish.name;
        axios.post('https://wetacaballina.herokuapp.com/meals', {"userName":userName,"price":"price",price,"link":link,"name":dishName})
        .then ( axios
          .get('https://wetacaballina.herokuapp.com/meals')
         .then(responseOrder => (this.order = responseOrder.data)))
      },

      totalPerUser(order,userName){
        var sum = 0;
        for(var i = 0; i < order.length; i++){
          if(order[i].userName==userName){
          sum = sum + order[i].price;
        }
        }
        return sum/100;
      }
    },

 

    mounted() {
      axios
      .get('https://wetacaballina.herokuapp.com/meals')
     .then(response => (this.order = response.data))
      
     axios
      .get('https://wetacaballina.herokuapp.com/users')
      .then(response => (this.users = response.data))

      axios.post("https://api.wetaca.com/graphql", { "operationName": "menu", "variables": {}, "query": "query menu {\n  menu {\n    dateFrom\n    dateTo\n    dishes {\n      id\n      name\n      slug\n      price\n      subscriptionPrice\n      allergens\n      category {\n        id: slug\n        name\n        slug\n        description\n        order\n        __typename\n      }\n      tags\n      isNew\n      isPromoted\n      frontPage\n      __typename\n    }\n    __typename\n  }\n}\n" })
        .then(responseDishes => {
          this.dishes = responseDishes.data.data.menu.dishes
          this.categories = [...new Set(responseDishes.data.data.menu.dishes.map(a => a.category.name))];
        });
    },
    
  });