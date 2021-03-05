<template>
    <div class="price-plan">
        <div class="plan-title" :class="plan">
          	<h2 class="title-name">{{ plans[plan].title }}</h2>
        </div>
        <div class="plan-price">
			<p class="price-symbol">$</p>
			<p class="price-amout">{{ plans[plan].price }}</p>
			<p class="price-period">/MO</p>
        </div>
		<p class="ann-bill">Bill Annually</p>
		<p class="saved-offer"><span class="old-price">{{ plans[plan].oldprice }}</span>{{ plans[plan].saved }}</p>
        <div class="plan-features">
          	
          	<div class="junket-point">
            	<div class="interest-num">
					<P class="txt">Points of Interest</P>
					<p class="num">{{ plans[plan].pointOfInterest }}</p>
            	</div>
            	<div class="divider"></div>
				<div class="interest-num">
					<P class="txt">Number of Junkets</P>
					<p class="num">{{ plans[plan].pointOfJunket }}</p>
				</div>
          	</div>
			<div class="feature-list" v-for="(item, index) in plans[plan].featureList" :key="index">
				<div class="feature-item" :class="index%2==0?'even':'odd'">	
					<p>{{item.title}}</p>
					<div v-if="item.txt">
						<p>{{item.value}}</p>
					</div>
					<div v-else>
						<img v-if="item.value" src="../../assets/images/check.svg" alt="">
						<img v-else src="../../assets/images/close.svg" alt="">
					</div>
				</div>
			</div>
        </div>
    </div>
</template>


<script> 
export default {
    name: 'PricePlan',
    
    props: {
        plan: { type: String, default: '' },
    },

    computed: {
        // computed
    },

    data: () => ({
       plans:{
		   	starter:{
				title: "Starter",
				price: "0",
				oldprice: "$49",
				saved: "Special 2020 Offer",
				pointOfInterest: "30",
				pointOfJunket: "1",
				featureList:[
					// {title:"Total Junket", value: 16, txt: true}, 
					// {title:"Outside App", value: "65%", txt: true}, 
					// {title:"In-App**", value: "40%", txt: true}, 
					{title:"Junket CMS", value: true, txt: false}, 
					{title:"iOS and Android App", value: true, txt: false}, 
					{title:"Audio Recordings", value: true, txt: false}, 
					{title:"Images", value: true, txt: false}, 
					{title:"Custom Map Icons", value: true, txt: false}, 
					{title:"Background Audio", value: true, txt: false}, 
					{title:"Sell Junkets", value: true, txt: false}, 
					{title:"Video", value: true, txt: false}, 
					{title:"Analytics", value: true, txt: false}, 
					{title:"Book Button on Your Site", value: true, txt: false}, 
					{title:"Free Junkets", value: false, txt: false}, 
					{title:"Junket Adventures", value: false, txt: false}, 
					{title:"Trohies and Prizes", value: false, txt: false}, 
					{title:"Website Integration", value: false, txt: false}, 
					{title:"Social Features", value: false, txt: false}, 
					{title:"Native App Integration", value: false, txt: false}, 
				],
			},
		   	business:{
				title: "Business",
				price: "99",
				oldprice: "$120",
				saved: "Save $252/yr",
				pointOfInterest: "50",
				pointOfJunket: "2",
				featureList:[
					// {title:"Total Junket", value: 16, txt: true}, 
					// {title:"Outside App", value: "65%", txt: true}, 
					// {title:"In-App**", value: "40%", txt: true}, 
					{title:"Junket CMS", value: true, txt: false}, 
					{title:"iOS and Android App", value: true, txt: false}, 
					{title:"Audio Recordings", value: true, txt: false}, 
					{title:"Images", value: true, txt: false}, 
					{title:"Custom Map Icons", value: true, txt: false}, 
					{title:"Background Audio", value: true, txt: false}, 
					{title:"Sell Junkets", value: true, txt: false}, 
					{title:"Video", value: true, txt: false}, 
					{title:"Analytics", value: true, txt: false}, 
					{title:"Book Button on Your Site", value: true, txt: false}, 
					{title:"Free Junkets", value: true, txt: false}, 
					{title:"Junket Adventures", value: true, txt: false}, 
					{title:"Trohies and Prizes", value: true, txt: false}, 
					{title:"Website Integration", value: true, txt: false}, 
					{title:"Social Features", value: true, txt: false}, 
					{title:"Native App Integration", value: false, txt: false}, 
				],
		   },
		   junketeer:{
				title: "Junketeer",
				price: "119",
				oldprice: "$175",
				saved: "Save $672/yr",
				pointOfInterest: "75",
				pointOfJunket: "3",
				featureList:[
					// {title:"Total Junket", value: 16, txt: true}, 
					// {title:"Outside App", value: "65%", txt: true}, 
					// {title:"In-App**", value: "40%", txt: true}, 
					{title:"Junket CMS", value: true, txt: false}, 
					{title:"iOS and Android App", value: true, txt: false}, 
					{title:"Audio Recordings", value: true, txt: false}, 
					{title:"Images", value: true, txt: false}, 
					{title:"Custom Map Icons", value: true, txt: false}, 
					{title:"Background Audio", value: true, txt: false}, 
					{title:"Sell Junkets", value: true, txt: false}, 
					{title:"Video", value: true, txt: false}, 
					{title:"Analytics", value: true, txt: false}, 
					{title:"Book Button on Your Site", value: true, txt: false}, 
					{title:"Free Junkets", value: true, txt: false}, 
					{title:"Junket Adventures", value: true, txt: false}, 
					{title:"Trohies and Prizes", value: true, txt: false}, 
					{title:"Website Integration", value: true, txt: false}, 
					{title:"Social Features", value: true, txt: false}, 
					{title:"Native App Integration", value: true, txt: false}, 
				],
		   }
	   }
    }),

    methods: {
        
    },

    watch: {
        
    },
}
</script>

<style scoped>

	.price-plan{
		width: 240px;
		background: #fff;
		border: solid 1px #aaa;
		border-radius: 2px;
		margin-top: 0px!important;
		
	}

	.plan-title{
		background-color: #6FC396;
		color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 0px!important;
	}

	.plan-title.business{
		background-color: #61a7db;
	}

	.plan-title.junketeer{
		background-color: #405764;
	}

	.plan-title .title-name{
		font-size: 1.7rem;
		font-weight: 300;
		margin: 0px;
		padding: 8px;
	}

	.old-price{
		color: #ea3844;
		text-decoration: line-through;
		padding-right: 5px;
		font-weight: 300;
	}

	.plan-price{
		display: flex;
		justify-content: center;
	}
	.plan-price p{
		margin: 0px;
	}

	.plan-price .price-symbol{
		font-size: 15px;
		padding-top: 15px;
	}
	.plan-price .price-amout{
		font-size: 45px;
	}
	.plan-price .price-period{
		font-size: 20px;
		padding-bottom: 10px;
		display: flex;
		align-items: flex-end;
		font-weight: 500;
	}

	.ann-bill{
		font-size: 12px;
		color: rgb(110, 110, 110);
		text-align: center;
		margin: 0px;
		line-height: 12px;
		margin-top: -10px;
	}

	.saved-offer{
		font-size: 15px;
		color: #61a7db;
		text-align: center;
		font-weight: 500;
		margin: 0px;
		line-height: 17px;
	}

	.plan-features .junket-point{
		display: flex;	
	}

	.plan-features .junket-point .interest-num, .junket-num{
		flex-basis: 50%;
	}
	

	.interest-num p, .junket-point p{
		font-size: 12px;
		margin-bottom: 0px;
		text-align: center;
	}

	.interest-num .num, .junket-num p{
		font-size: 15px;
		font-weight: 500;
		color: #000;
	}
	
	.divider{
		height: 60;
		width: 1px;
		background-color: #aaa;
	}

	.feature-list div{
		margin-top: 0px!important;
	}

	.feature-list p{
		margin: 0px!important;
		font-size: 14px;
		font-weight: 300;
	}

	.feature-list, .feature-item{
		margin-top: 0px!important;
	}

	.feature-list .even{
		background-color: #ebebeb;
	}

	.feature-list .odd{
		background-color: #fff;
	}

	.feature-item{
		display: flex;
		justify-content: space-between;
		padding: 2px 20px;
	}

	.feature-item img{
		height: 15px;
	}

</style>