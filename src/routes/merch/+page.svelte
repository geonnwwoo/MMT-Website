<script>
    /** @type {import('./$types').PageData} */
    import PageHeader from "$lib/components/PageHeader.svelte";
    import CardPanelBox from "$lib/components/CardPanelBox.svelte"

    const products = [
        {
            title: "Test Hoodie",
            image: "/merch/merchtestimg.webp",
            alt: "image of hoodie",
            sizes: ["S", "L", "XL"]
        },
        {
            title: "Test Hoodie",
            image: "/merch/merchtestimg.webp",
            alt: "image of hoodie",
            sizes: ["S", "L", "XL"]
        },
        {
            title: "Test Hoodie",
            image: "/merch/merchtestimg.webp",
            alt: "image of hoodie",
            sizes: ["S", "L", "XL"]
        },
        {
            title: "Test Hoodie",
            image: "/merch/merchtestimg.webp",
            alt: "image of hoodie",
            sizes: ["S", "L", "XL"]
        }
    ]
</script>

<svelte:head>
	<title>Mustang Math Merch</title>
</svelte:head>

<PageHeader
	title="Merch"
	description="Shop Mustang Math Merch!"
	button_url=""
	button_text="Shop Now"
	id=""
/>

<CardPanelBox>
    <div class="product-grid">
        {#each products as product}
            <div class="product">
                <h2 class="title">{product.title}</h2>
                <img class="image" src={product.image} alt={product.alt} loading="lazy"/>
                <div class="size-container">
                    {#each product.sizes as size}
                        <button class="size-button">{size}</button>
                    {/each}
                    <p class="size-quantity">999</p>
                </div>
            </div>
        {/each}
    </div>
</CardPanelBox>

<style>

h2 {
    font-weight: 800;
    font-size: 1.8rem;
    color: #333;
}

.product-grid{
    display: grid;
    box-sizing: border-box;
    grid-template-columns: repeat(auto-fill, minmax(600px, 1fr));
    justify-content: center;
    gap: 10px;
}


.product{
    display: flex;
    flex-direction: column;
    background-color: white;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    padding: 1.2rem;
}

.image {
    object-fit: cover;
}   

.size-container {
    display: flex;
    margin-top: 15px;
}

.size-button {
    background-color: white;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    padding: .25rem 1.5rem;
    margin-right: .25rem;
}

.size-quantity {
    margin-left: auto;
    font-size: 1.2rem;
    color: #333;
}

.size-quantity::after {
    content: " left";
}
</style>