<template lang="pug">
    .page-index
        .index
            el-carousel(:interval="5000", height="400px")
                el-carousel-item(v-for="banner in banners")
                    a(v-bind:href="banner.route.path",target="_blank")
                        img(:src="banner.src", :alt="banner.dec")
            o-content
</template>

<script>
    import oContent from '../../components/common/oContent/index.vue';

    export default {
        components: {oContent},

        data: () => ({
            banners: [
                {
                    src: require('~images/ong-ont.png'),
                    preview: require('~images/ong-ont.png'),
                    dec: 'ong-ont',
                    route: {
                        path: '//otcgo.cn/download/'
                    }
                },
                /*{
                  src: require("~images/app-download.jpg"),
                  preview: require("~images/app-download.jpg"),
                  dec: "sea app download",
                  route: {
                    path: "//otcgo.cn/download/"
                  }
                }*/
                {
                    src: require('~images/banner_99.jpg'),
                    preview: require('~images/banner_99.jpg'),
                    dec: '九九重阳节',
                    route: {
                        path: '/'
                    }
                }
            ],
            loading: false
        })
    };
</script>

<style lang="stylus">
    .el-table__body {
        text-align: center;
    }

    .el-table__header .is-leaf {
        text-align: center;
    }

    @media (max-width: 500px) {
        .el-carousel {
            display: none;
        }

        form.navbar-right {
            display: none;
        }

        .el-carousel__item img {
            width: 100%;
            height: 400px;
        }

        .el-carousel__container > button {
            display: none;
        }

        /* .carousel-control
              background: #8e8e8e;
              height: 100px;
              line-height: 100px;
              font-size: 50px !important;
              width: 51px !important;
              margin-top: 140px;
              text-shadow: 0 1px 2px rgba(0, 0, 0, 0);
              background-image: none;

            .carousel-inner img
              width: 100%;
              height: 400px; */
    }
</style>
