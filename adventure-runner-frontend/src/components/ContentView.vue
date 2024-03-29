<script setup lang="ts">
import type { SpellDescData } from '@/model/SpellDescData';
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router';
import InitiativeTracker from './InitiativeTracker.vue'
import SelectedSpell from './SelectedSpell.vue'

const route = useRoute();

const content = ref("");

const fetchContent = async () => {
    const contentPath = route.params.path?.length ? (route.params.path as string[]).join("/") : route.params.path;
    content.value = await (await fetch("/api/content/" + contentPath)).text();
}

const spellRef = ref<SpellDescData>();

const handleClickedContent = (event: any) => {
    if (event.target?.classList?.contains("spell-clickable")) {
        spellRef.value = JSON.parse(event.target.dataset.spell);
    }
}

onMounted(() => {
    fetchContent();
});
</script>

<template>
    <div class="content-view" @click="handleClickedContent">
        <div class="side">
            <InitiativeTracker />
            <SelectedSpell :spell="spellRef" />
        </div>
        <div class="content" v-html="content" />
    </div>
</template>

<style lang="scss">
img {
    max-width: 100%;
}

.content-view {
    display: flex;

    .side {
        padding: 20px;
        width: 310px;
    }

    .content {
        padding: 20px;
        width: calc(100vw - 390px);
        overflow: auto;
        max-height: calc(100vh - 136px);

        .containerdivNewLine {
            clear: both;
            float: left;
            display: block;
            position: relative;
        }
    }
}

.stat-block-wrapper {
    width: 490px;
    margin: 0 20px 20px 0px;
    font-family: 'Noto Sans', 'Myriad Pro', Calibri, Helvetica,
        Arial, sans-serif;

    .stat-block {
        background: #FDF1DC;
        box-shadow: 0 0 0.7em #867453;
        margin-bottom: 15px;
        border-top: #7A200D 3px solid;
        overflow: visible;

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

            h4 {
                font-style: italic;
            }

            .spell-clickable {
                text-decoration: underline;
            }
        }

        h4,
        p,
        .spell-clickable {
            font-size: 13.5px;
            line-height: 1.2em;
            display: inline;
            margin: 0;
        }

        h3.underscored-heading {
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

.spacer {
    height: 1px;
    background-color: #7A200D;

    &.top {
        margin-top: 6px;
    }
}
</style>