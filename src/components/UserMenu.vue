<template>
	<div class="user-menu">
		<ul>
			<li><router-link to="/user/data">Dados</router-link></li>
			<li><router-link to="/user/products">Produtos</router-link></li>
			<li><router-link to="/user/orders">Pedidos</router-link></li>
		</ul>
	</div>
</template>

<script setup>

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
						a {
								padding: 20px;
								display: block;
								color: var(--text-color);
								text-decoration: none;
								transition: var(--transition);
								&:hover {
										color: var(--white-color);
								}
						}
				}
		}
}
</style>