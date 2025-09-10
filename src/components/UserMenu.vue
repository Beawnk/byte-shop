<template>
	<div class="user-menu" :class="{ open: menuOpen }">
		<ul>
			<li><router-link :to="{name: 'data'}">Dados</router-link></li>
			<li><router-link :to="{name: 'favorites'}">Favoritos</router-link></li>
			<li><router-link :to="{name: 'user-products'}">Produtos</router-link></li>
			<li><router-link :to="{name: 'orders'}">Pedidos</router-link></li>
			<li><router-link :to="{name: 'sales'}">Vendas</router-link></li>
			<li><router-link :to="{name: 'reviews'}">Avaliações</router-link></li>
			<li><button class="logout-btn" @click.prevent="userStore.logout">Sair</button></li>
		</ul>
		<div class="menu-btn">
			<button @click="menuOpen = !menuOpen">
				<span></span>
       			<span></span>
       			<span></span>
			</button>
		</div>
	</div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useUserStore } from '@/stores/UserState';
import { useRoute } from 'vue-router';

const userStore = useUserStore();
const route = useRoute();

watch(route, () => {
	menuOpen.value = false;
});

const menuOpen = ref(false);
</script>

<style lang="scss" scoped>
@use '@/assets/style/main.scss' as m;

.user-menu {
	width: 200px;
	@include m.media(758px) {
		position: absolute;
		top: calc(var(--section) + 10px);
		left: calc(var(--side) * -1 - 200px);
		z-index: 10;
		transition: var(--transition);
	}
	
	&.open {
		@include m.media(758px) {
			left: calc(var(--side) * -1 + 10px);
		}
	}

	ul {
		display: flex;
		flex-direction: column;
		gap: 5px;
		@include m.media(758px) {
			background-color: var(--background-color);
			border-radius: var(--border-radius) 0 var(--border-radius) var(--border-radius);
			padding: 10px;
			box-shadow: var(--shadow);
			z-index: 12;
			position: relative;
		}
		li {
			background-color: var(--background-color);
			border-radius: var(--border-radius);
			transition: var(--transition);
			&:hover {
				background-color: var(--secondary-color);
			}
			&:has(.router-link-exact-active) {
				background-color: var(--secondary-color);
			}
			a, button {
				padding: 20px;
				display: block;
				color: var(--text-color);
				text-decoration: none;
				transition: var(--transition);
				font-family: var(--ff-primary-Medium);
				font-size: var(--text-medium);
				width: 100%;
				text-align: left;
				&:hover {
					color: var(--white-color);
				}
				&.router-link-exact-active {
					color: var(--white-color);
				}
			}
		}
	}
	.menu-btn {
		display: none;
		position: absolute;
		right: -39px;
		top: 0;
		z-index: 15;
		@include m.media(758px) {
			display: block;
		}

		&::after {
			content: "";
  			position: absolute;
  			top: 0;
  			left: 6px;
  			bottom: 0;
  			width: 34px;
			height: 40px;
  			box-shadow: var(--shadow);
			z-index: -1;
			border-radius: 0 var(--border-radius) var(--border-radius) 0;
			display: block;
		}

		button {
			display: flex;
  			flex-direction: column;
  			justify-content: space-between;
			gap: 3px;
			width: 30px;
			height: 30px;
			background-color: var(--background-color);
			padding: 20px;
			border-radius: 0 var(--border-radius) var(--border-radius) 0;
			position: relative;

			span {
				display: block;
  				width: 20px;
  				height: 3px;
  				background: var(--primary-color);
  				transition: var(--transition);
				position: absolute;
        		left: 50%;
        		transform: translateX(-50%);
				border-radius: var(--border-radius);

				&:nth-child(1) {
        		  top: 13px;
        		}
			
        		&:nth-child(2) {
        		  top: 19px;
        		}
			
        		&:nth-child(3) {
        		  top: 25px;
        		}
			}
		}
	}

	&.open .menu-btn button span {
		&:nth-child(1) {
            top: 18px;
            transform: translateX(-50%) rotate(45deg);
		}
		&:nth-child(2) {
			opacity: 0;
		}
		&:nth-child(3) {
            top: 18px;
            transform: translateX(-50%) rotate(-45deg);
		}
	}
}
</style>