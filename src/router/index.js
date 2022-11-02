import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import RecipeDetails from "@/views/RecipeDetails.vue";
import SearchResults from "@/views/SearchResults.vue";
import RecipeRecommendation from "@/views/RecipeRecommendation.vue";
import Event from "@/views/Event.vue";
import NotFound from "@/views/NotFound.vue";
import CreateRecipe from "@/views/CreateRecipe.vue";
import { useUserStore } from "@/stores/user";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/register",
      name: "register",
      component: Register,
    },
    {
      path: "/recipe/:id",
      name: "recipeDetail",
      component: RecipeDetails,
    },
    {
      path: "/recipes",
      name: "searchResults",
      component: SearchResults,
      props: (route) => ({ query: route.query.name }),
    },
    {
      path: "/recipes/recommendation",
      name: "recipeRecommendation",
      component: RecipeRecommendation,
    },
    {
      path: "/events",
      name: "events",
      component: Event,
    },
    {
      path: "/create",
      name: "recipeNew",
      component: CreateRecipe,
    },
    { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
  ],
});

router.beforeEach((to, from) => {
  const { user } = useUserStore();

  if (user && (to.name === "login" || to.name === "register")) {
    return { name: "home" };
  }
});

export default router;
