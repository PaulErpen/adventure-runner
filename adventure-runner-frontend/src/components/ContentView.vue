<script setup lang="ts">
import { useRouteStore } from '@/stores/route';
import { ref, onMounted } from 'vue'

const content = ref("");

const route = useRouteStore();

const fetchContent = async () => {
    content.value = await (await fetch("/api/content/" + route.contentPath)).text();
}

onMounted(() => {
    fetchContent();
});
</script>

<template>
    <div class="content" v-html="content" />
</template>

<style lang="scss">
.content {
    padding: 20px;

    .containerdivNewLine {
        clear: both;
        float: left;
        display: block;
        position: relative;
    }
}

.stat-block-wrapper {
    width: 490px;
    margin: 0 20px 20px 0px;
    font-family: 'Noto Sans', 'Myriad Pro', Calibri, Helvetica,
        Arial, sans-serif;

    .stat-block {
        background: #FDF1DC;
        box-shadow: 0 0 1.5em #867453;
        margin-bottom: 15px;
        border-top: #7A200D 3px solid;

        .col {
            width: 450px;
        }

        .first-col {
            padding: 5px 10px 0px;

        }

        .second-col {
            padding: 5px 10px 20px;


        }

        .creature-heading {
            h1 {
                font-family: 'Libre Baskerville', 'Lora', 'Calisto MT', 'Bookman Old Style', Bookman, 'Goudy Old Style', Garamond, 'Hoefler Text', 'Bitstream Charter', Georgia, serif;
                color: #922610;
                font-size: 23px;
                line-height: 1.2em;
                margin: 10px 0 0;
                letter-spacing: 1px;
                font-variant: small-caps;
                font-weight: bold;
            }

            h2 {
                font-weight: normal;
                font-style: italic;
                font-size: 12px;
                line-height: 1.2em;
                margin: 0 0 10px;
            }
        }

        .top-stats {
            margin: 5px 0 8px 0;

            .property-line {

                h4,
                p {
                    display: inline;
                    margin: 0;
                    color: #922610;
                    font-size: 13.5px;
                    line-height: 1.2em;
                }
            }

            .abilities-block {
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                justify-content: space-between;

                .ability-score {
                    display: flex;
                    flex-direction: column;
                    align-items: center;

                    .ability-score-name {
                        font-weight: bold;
                        margin: 10px 0 2px;
                        font-size: 14px;
                        line-height: 1.2em;
                        text-transform: uppercase;
                        color: #7A200D;
                    }

                    .ability-score-mod,
                    .ability-score-value {
                        display: inline-block;
                        color: #7A200D;
                        margin: 0 0 10px;
                        line-height: 1.2em;
                        font-size: 13.5px;
                    }
                }
            }
        }

        .property-block {
            padding: 10px 2px 0;

            h4,
            p {
                font-size: 13.5px;
                line-height: 1.2em;
                display: inline;
                margin: 0;
            }

            h4 {
                font-style: italic;
            }
        }

        h3.actions {
            border-bottom: 1px solid #7A200D;
            color: #7A200D;
            font-size: 23px;
            font-variant: small-caps;
            font-weight: normal;
            letter-spacing: 1px;
            margin: 20px 0 0;
            padding: 0 0 10px;
            text-indent: 5px;
        }

        .spacer {
            height: 1px;
            background-color: #7A200D;

            &.top {
                margin-top: 6px;
            }
        }
    }

    &.wide {
        width: 940px;

        .stat-block {
            overflow: auto;

            .col {
                float: left;
            }

            .first-col {
                padding-bottom: 20px;
            }
        }
    }

    &.float {
        float: left;
    }
}

@media print {
    .stat-block-wrapper {
        .stat-block {
            box-shadow: unset;
        }
    }
}
</style>