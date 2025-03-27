const skyblockAssets = require('../build')
const assert = require('assert')
const path = require('path')
const fs = require('fs')

const vanilla = require('../matchers/vanilla.json')
const hypixelplus = require('../matchers/hypixel+.json')
const furfsky_reborn = require('../matchers/furfsky_reborn.json')

function assertIsPack(textureUrl, packName) {
    assert.ok(
        textureUrl.startsWith(`${skyblockAssets.baseUrl}/textures/${packName}/`)
    )
}

// check if the two files are identical
function checkFilesMatch(file1, file2) {
    const hash1 = fs.readFileSync(file1, 'utf8')
    const hash2 = fs.readFileSync(file2, 'utf8')
    if (hash1 !== hash2) {
        console.log(`${file1} and ${file2} do not match`)
    }
    return hash1 === hash2
}

describe('skyblock-assets', () => {
    describe('Get texture URL/dir', () => {
        it('Checks every vanilla item', async() => {
            const itemlessBlocks = new Set([
                'air', 'water', 'flowing_water', 'lava', 'flowing_lava', 'piston_head', 'double_stone_slab',
                'fire', 'redstone_wire', 'lit_furnace', 'standing_sign', 'wall_sign', 'lit_redstone_ore',
                'unlit_redstone_torch', 'portal', 'unpowered_repeater', 'powered_repeater', 'pumpkin_stem',
                'melon_stem', 'end_portal', 'lit_redstone_lamp', 'double_wooden_slab', 'cocoa', 'carrots',
                'potatoes', 'unpowered_comparator', 'powered_comparator', 'standing_banner', 'wall_banner',
                'daylight_detector_inverted', 'double_stone_slab2',

                'purpur_double_slab', 'end_gateway', 'frosted_ice', 'beetroots'
            ])
            for (const item of Object.values(skyblockAssets.minecraftIds)) {
                if (itemlessBlocks.has(item.slice('minecraft:'.length))) continue
                const itemTextureUrl = skyblockAssets.getTextureUrl({
                    id: item,
                    nbt: {},
                    packs: [ vanilla ],
                })
                assert.ok(itemTextureUrl, skyblockAssets.baseUrl + '/renders/vanilla/error.png', `${item} doesn't even have an error texture???`)
                assert.notStrictEqual(itemTextureUrl, skyblockAssets.baseUrl + '/renders/vanilla/error.png', `Couldn't find texture for ${item}`)
                const itemTexturePath = path.join(__dirname, '..', itemTextureUrl.slice(skyblockAssets.baseUrl.length))
                await fs.promises.access(itemTexturePath, fs.F_OK)
            }
        })

        it('Checks every vanilla item but with FurfSky Reborn enabled', async() => {
            const itemlessBlocks = new Set([
                'air', 'water', 'flowing_water', 'lava', 'flowing_lava', 'piston_head', 'double_stone_slab',
                'fire', 'redstone_wire', 'lit_furnace', 'standing_sign', 'wall_sign', 'lit_redstone_ore',
                'unlit_redstone_torch', 'portal', 'unpowered_repeater', 'powered_repeater', 'pumpkin_stem',
                'melon_stem', 'end_portal', 'lit_redstone_lamp', 'double_wooden_slab', 'cocoa', 'carrots',
                'potatoes', 'unpowered_comparator', 'powered_comparator', 'standing_banner', 'wall_banner',
                'daylight_detector_inverted', 'double_stone_slab2',

                'purpur_double_slab', 'end_gateway', 'frosted_ice', 'beetroots'
            ])
            for (const item of Object.values(skyblockAssets.minecraftIds)) {
                if (itemlessBlocks.has(item.slice('minecraft:'.length))) continue
                const itemTextureUrl = skyblockAssets.getTextureUrl({
                    id: item,
                    nbt: {},
                    packs: [ furfsky_reborn, vanilla ],
                })
                assert.ok(itemTextureUrl, skyblockAssets.baseUrl + '/renders/vanilla/error.png', `${item} doesn't even have an error texture???`)
                assert.notStrictEqual(itemTextureUrl, skyblockAssets.baseUrl + '/renders/vanilla/error.png', `Couldn't find texture for ${item}`)
                const itemTexturePath = path.join(__dirname, '..', itemTextureUrl.slice(skyblockAssets.baseUrl.length))
                await fs.promises.access(itemTexturePath, fs.F_OK)
            }
        })

        it('Make sure lit furnace is null', () => {
            // not like anyone's actually gonna have this, but i want it to be 100% correct
            const itemTextureUrl = skyblockAssets.getTextureUrl({
                id: 'minecraft:lit_furnace',
                nbt: {},
                packs: [ vanilla ],
            })
            assert.strictEqual(itemTextureUrl, skyblockAssets.baseUrl + '/renders/vanilla/error.png')
        })

        it('Make sure red sand is not null', () => {
            const itemTextureUrl = skyblockAssets.getTextureUrl({
                id: 'minecraft:red_sand',
                nbt: {},
                packs: [ vanilla ],
            })
            assert.notStrictEqual(itemTextureUrl, skyblockAssets.baseUrl + '/renders/vanilla/error.png')
        })

        it('Check SkyBlock menu on Hypixel+', () => {
            const itemTextureUrl = skyblockAssets.getTextureUrl({
                id: 'minecraft:nether_star',
                nbt: {
                    ExtraAttributes: {
                        id: 'SKYBLOCK_MENU'
                    },
                    display: {
                        Name: 'SkyBlock Menu (Right Click)'
                    }
                },
                packs: [ hypixelplus, vanilla ],
            })
            assertIsPack(itemTextureUrl, 'hypixel+')
        })

        it('Check SkyBlock menu on Furfsky Reborn', () => {
            const itemTextureUrl = skyblockAssets.getTextureUrl({
                id: 'minecraft:nether_star',
                nbt: {
                    ExtraAttributes: {
                        id: 'SKYBLOCK_MENU'
                    },
                    display: {
                        Name: 'SkyBlock Menu (Right Click)'
                    }
                },
                packs: [ furfsky_reborn, vanilla ],
            })
            assertIsPack(itemTextureUrl, 'furfsky_reborn')
        })

        it('Check AOTD on Hypixel+', () => {
            const itemTextureUrl = skyblockAssets.getTextureUrl({
                id: 'minecraft:diamond_sword',
                nbt: {
                    ExtraAttributes: {
                        id: 'ASPECT_OF_THE_DRAGON'
                    },
                    display: {
                        Name: 'Legendary Aspect of the Dragons'
                    }
                },
                packs: [ hypixelplus, vanilla ],
            })

            assertIsPack(itemTextureUrl, 'hypixel+')
        })

        it('Check Titanium Drill DR x555 on FurfSky Reborn', () => {
            // this checks that the first lore line is empty
            const itemTextureDir = skyblockAssets.getTextureDir({
                id: 'minecraft:prismarine_shard',
                nbt: {
                    display: {
                        Lore: [
                            '',
                            'dsasdfasdfasdf'
                        ]
                    }
                },
                packs: [ furfsky_reborn ],
            })

            assert.ok(checkFilesMatch(itemTextureDir, 'renders/furfsky_reborn/mcpatcher/cit/item/tools/drills/titanium_drill_dr_x555/titanium_drill_dr_x555.png'))
        })

        it('Check minecraft:item:id', () => {
            const itemTextureDir = skyblockAssets.getTextureDir({
                id: 'minecraft:dye:3',
                packs: [ vanilla ],
            })

            assert.ok(checkFilesMatch(itemTextureDir, `packs/vanilla/textures/items/brown_dye.png`))
        })

        it('Check itemid:id', () => {
            const itemTextureDir = skyblockAssets.getTextureDir({
                id: '351:3',
                packs: [ vanilla ],
            })

            assert.ok(checkFilesMatch(itemTextureDir, `packs/vanilla/textures/items/brown_dye.png`))
        })

        it('Check melon slice', () => {
            const itemTextureDir = skyblockAssets.getTextureDir({
                id: 'minecraft:melon',
                packs: [ vanilla ],
            })

            assert.ok(checkFilesMatch(itemTextureDir, `packs/vanilla/textures/items/melon.png`))
        })
    })
})
