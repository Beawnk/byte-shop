<template>
	<div class="user-menu">
		<ul>
			<li><router-link :to="{name: 'data'}">Dados</router-link></li>
			<li><router-link :to="{name: 'products'}">Produtos</router-link></li>
			<li><router-link :to="{name: 'orders'}">Pedidos</router-link></li>
			<li><router-link :to="{name: 'sales'}">Vendas</router-link></li>
			<li><router-link :to="{name: 'reviews'}">Avaliações</router-link></li>
			<li><button class="logout-btn" @click.prevent="loginStore.logout">Sair</button></li>
		</ul>
	</div>
</template>

<script setup>
import { useLoginStore } from '@/stores/LoginState';

const loginStore = useLoginStore();
</script>

<style lang="scss" scoped>
.user-menu {
	width: 200px;
	ul {
		display: flex;
		flex-direction: column;
		gap: 5px;
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
}
</style>