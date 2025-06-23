import { EntityEquippableComponent, EntityHealthComponent, EntityInventoryComponent, EntityProjectileComponent, EquipmentSlot, GameMode, ItemDurabilityComponent, ItemEnchantableComponent, system, world } from "@minecraft/server";
world.sendMessage("Custom Bows loaded!");
world.afterEvents.itemReleaseUse.subscribe((data) => {
    const player = data.source;
    const equippable = player.getComponent(EntityEquippableComponent.componentId);
    if (!equippable)
        return;
    const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);
    const item = mainhand.getItem();
    if (!item)
        return;
    let damage = undefined;
    for (const tag of item.getTags()) {
        if (damage !== undefined)
            continue;
        if (!tag.startsWith("custom_bow:bow_damage:"))
            continue;
        damage = JSON.parse(tag.split(":")[2]);
    }
    if (damage === undefined)
        return;
    const useDuration = ((6000 * 20) - data.useDuration) / 20;
    if (useDuration < 0.17)
        return;
    const enchantable = item.getComponent(ItemEnchantableComponent.componentId);
    if (enchantable?.getEnchantment("power"))
        damage = damage + Math.round((damage / 4) * (enchantable.getEnchantment("power").level + 1));
    if (player.getGameMode() !== GameMode.creative) {
        let foundArrow = false;
        for (const id in EquipmentSlot) {
            if (foundArrow)
                continue;
            const slot = equippable.getEquipmentSlot(id);
            const item = slot.getItem();
            if (item?.typeId !== "minecraft:arrow")
                continue;
            foundArrow = true;
            if ((item.amount - 1) > 0) {
                item.amount--;
                slot.setItem(item);
            }
            else
                slot.setItem(undefined);
        }
        if (!foundArrow) {
            const inv = player.getComponent(EntityInventoryComponent.componentId)?.container;
            if (!inv)
                return;
            for (let i = 0; i < inv.size; i++) {
                if (foundArrow)
                    continue;
                const item = inv.getItem(i);
                if (!item || item.typeId !== "minecraft:arrow")
                    continue;
                foundArrow = true;
                if ((item.amount - 1) > 0) {
                    item.amount--;
                    inv.setItem(i, item);
                }
                else
                    inv.setItem(i, undefined);
            }
        }
        if (!foundArrow)
            return;
    }
    mainhand.setItem(decreaseItemDurability(player, item, 1));
    const headLoc = player.getHeadLocation();
    const arrow = player.dimension.spawnEntity("custom_bow:arrow", { x: headLoc.x, y: 100, z: headLoc.z });
    if (enchantable?.getEnchantment("flame"))
        arrow.setOnFire(999999);
    arrow.setDynamicProperty("damage", (damage * (useDuration > 1 ? 1 : useDuration)));
    arrow.teleport(headLoc);
    const comp = arrow.getComponent(EntityProjectileComponent.componentId);
    if (!comp)
        return;
    comp.owner = player;
    const viewDir = player.getViewDirection();
    const vel = 4.8 * (useDuration > 1 ? 1 : useDuration);
    comp.shoot({ x: viewDir.x * vel, y: viewDir.y * vel, z: viewDir.z * vel });
    player.dimension.playSound("random.bow", headLoc);
});
world.afterEvents.itemStartUse.subscribe((data) => {
    const player = data.source;
    const equippable = player.getComponent(EntityEquippableComponent.componentId);
    if (!equippable)
        return;
    const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);
    const item = mainhand.getItem();
    if (!item)
        return;
    let damage = undefined;
    for (const tag of item.getTags()) {
        if (damage !== undefined)
            continue;
        if (!tag.startsWith("custom_bow:bow_damage:"))
            continue;
        damage = JSON.parse(tag.split(":")[2]);
    }
    if (damage === undefined)
        return;
    if (player.getGameMode() !== GameMode.creative) {
        let foundArrow = false;
        for (const id in EquipmentSlot) {
            if (foundArrow)
                continue;
            const slot = equippable.getEquipmentSlot(id);
            const item = slot.getItem();
            if (item?.typeId !== "minecraft:arrow")
                continue;
            foundArrow = true;
        }
        if (!foundArrow) {
            const inv = player.getComponent(EntityInventoryComponent.componentId)?.container;
            if (!inv)
                return;
            for (let i = 0; i < inv.size; i++) {
                if (foundArrow)
                    continue;
                const item = inv.getItem(i);
                if (!item || item.typeId !== "minecraft:arrow")
                    continue;
                foundArrow = true;
            }
        }
        if (!foundArrow)
            return;
    }
    player.playAnimation(equippable.getEquipmentSlot(EquipmentSlot.Offhand).getItem() ? "animation.custom_bow.player.bow.left_item" : "animation.custom_bow.player.bow", { stopExpression: "!q.is_using_item" });
});
world.afterEvents.entityHurt.subscribe((data) => {
    const projectile = data.damageSource.damagingProjectile;
    if (!projectile || !projectile.isValid())
        return;
    if (projectile?.typeId != "custom_bow:arrow")
        return;
    if (!data.hurtEntity || !data.hurtEntity.isValid())
        return;
    const damage = projectile.getDynamicProperty("damage");
    if (damage === undefined)
        return;
    const comp = data.hurtEntity.getComponent(EntityHealthComponent.componentId);
    comp.setCurrentValue(comp.currentValue - ((data.damage * (damage - 1))));
    projectile.remove();
});
function* updateInventory(player) {
    const inv = player.getComponent(EntityInventoryComponent.componentId)?.container;
    if (!inv)
        return;
    for (let i = 0; i < inv.size; i++) {
        const item = inv.getItem(i);
        if (!item)
            continue;
        let damage = undefined;
        for (const tag of item.getTags()) {
            if (damage !== undefined)
                continue;
            if (!tag.startsWith("custom_bow:bow_damage:"))
                continue;
            damage = JSON.parse(tag.split(":")[2]);
        }
        if (damage === undefined)
            continue;
        const enchantable = item.getComponent(ItemEnchantableComponent.componentId);
        if (enchantable?.getEnchantment("power"))
            damage = damage + Math.round((damage / 4) * (enchantable.getEnchantment("power").level + 1));
        if (item.getLore()[0] === `\n§r§9+${damage} Damage`)
            continue;
        item.setLore([`\n§r§9+${damage} Damage`]);
        inv.setItem(i, item);
    }
}
system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        if (!player || !player.isValid())
            continue;
        system.runJob(updateInventory(player));
    }
}, 5);
function decreaseItemDurability(player, item, amount) {
    const gamemode = player.getGameMode();
    if (gamemode !== GameMode.survival && gamemode !== GameMode.adventure)
        return item;
    const comp = item.getComponent(ItemDurabilityComponent.componentId);
    if (!comp)
        return item;
    let chance = 0;
    const unbreaking = item.getComponent(ItemEnchantableComponent.componentId)?.getEnchantment("unbreaking");
    if (unbreaking)
        chance = unbreaking.level * 0.25;
    if (chance > Math.random())
        return item;
    if (comp.damage + amount > comp.maxDurability) {
        player.playSound("random.break");
        return undefined;
    }
    comp.damage += amount;
    return item;
}
