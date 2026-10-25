# Game Design Document — ขมังเวท (Working Title)

## 1. High Concept
A Thai occult dark-fantasy MMORPG where players study magical arts, inscribe sacred tattoos, craft talismans, investigate hauntings, and cooperate or compete in a supernatural world inspired by Thai folklore and historical atmosphere.

## 2. Product Constraints
- Platform: Web PC, keyboard/mouse first.
- Camera: orthographic isometric, with limited zoom; camera rotation is optional and deferred until proven necessary.
- Visual: 3D environment + 2D HD characters.
- Combat: hybrid target-based and directional/area combat.
- World: separate zones/rooms rather than seamless world at MVP.
- Development: solo developer aided by AI; modular monolith first.
- Tone: eerie, mystical, respectful fictional reinterpretation of cultural motifs. Avoid presenting invented gameplay rituals as real-world instructions.

## 3. Design Pillars
1. **Occult preparation matters:** talismans, learned arts, consumables, and knowledge affect how encounters are approached.
2. **Readability over visual noise:** players can identify threats, cast timing, safe zones, and status effects.
3. **Player identity through build choices:** tattoo slots, talisman loadouts, and arts create meaningful trade-offs.
4. **Cooperative supernatural encounters:** bosses have mechanics that reward preparation and role diversity.
5. **Trustworthy online rules:** server decides combat, rewards, currency, and item ownership.
6. **Scope discipline:** every system must support the core loop or be deferred.

## 4. Target Player Experience
The player arrives at a settlement, receives a case of unexplained hauntings, gathers clues and materials, prepares a build, enters a dangerous zone, defeats or appeases a spirit, earns knowledge/materials, then returns to improve their character and reputation.

## 5. Core Loop
Discover case -> investigate clues -> prepare equipment/arts -> enter zone -> combat/ritual encounter -> earn rewards -> learn/craft/upgrade -> unlock harder cases.

## 6. MVP Scope
- 1 starting village hub.
- 1 small haunted forest / ruined shrine zone.
- 1 controllable character archetype with two build paths.
- 6–8 skills total across two paths, not all required at launch.
- 3 basic enemies and 1 boss.
- 3 quest types: tutorial, investigation, hunt.
- Character save/load, inventory, equipment, basic loot, one consumable craft.
- Multiplayer room with a small test cohort; target capacity determined by profiling.
- Basic account/session flow.
- Minimal UI: character status, skill bar, target indicator, health/resource, inventory, quest tracker.
- Admin/debug commands only in development environments.

## 7. Deferred Beyond MVP
- Seamless continent/world.
- Large-scale guild wars.
- Player auction house and player-to-player currency trading.
- Housing, mounts, pet collection, marriage/social systems.
- Many classes, dozens of zones, large raids.
- Complex karma alignment and permanent consequences.
- Real-money economy or paid randomized rewards.
- Mobile support until browser PC performance and input are stable.

## 8. Character Progression
Progression layers:
- Character level: baseline stats and access gates.
- Learned arts: unlockable active/passive abilities.
- Tattoo loadout: limited slots; trade-off based passive/conditional effects.
- Amulet/talisman loadout: equipment with clear effects and rarity.
- Knowledge/reputation: quest and faction unlocks.
- Crafting: materials into consumables or selected gear.
Avoid multiplicative stat stacking without caps and simulation. Prefer additive/controlled formulas with explicit coefficients.

## 9. Starting Archetypes (MVP)
### Yantra Adept
- Role: ranged/control and area denial.
- Fantasy: deploys talisman marks and delayed magical zones.
- Weakness: cast commitment, positioning, resource management.

### Spirit Medium
- Role: debuff, short-lived summon/companion, disruption.
- Fantasy: binds or distracts spirits and weakens enemies.
- Weakness: lower direct burst, summon management.

These are build paths for the first prototype, not a promise of a rigid final class system.

## 10. Encounter Design
Every enemy/encounter must define:
- Intent readable to player.
- Attack pattern and telegraph.
- Range, timing, cooldown, damage and status.
- Counterplay (dodge, interrupt, cleanse, reposition, preparation).
- Reward table and repeatability.
- Multiplayer scaling rules if applicable.
- Accessibility/readability constraints for color, sound, and animation.

## 11. Occult System Design Principles
- Tattoo effects must have explicit slot/cost/condition and avoid mandatory best-in-slot patterns.
- Talismans must have clear provenance and gameplay effect descriptions.
- Karma/alignment should create choices, not trap players in an irreversible bad state.
- Ritual gameplay should be fictional puzzle/encounter mechanics, not real-world ritual guidance.
- Rare materials must have multiple reasonable acquisition paths.
- Avoid making core power dependent on random rolls alone.

## 12. Economy
MVP: NPC sell/buy with controlled prices, enemy loot, crafting costs, currency sinks.
Later: player trade only after item duplication, rollback, transaction logging, fraud and bot abuse protections are designed.

## 13. Success Criteria
- New player completes tutorial and first hunt without developer intervention.
- Players understand why an attack hit/missed and why a skill was unavailable.
- Combat outcomes are consistent across clients.
- Character/inventory survive relog.
- No known critical item duplication or reward duplication bugs.
- Performance budget measured on target browsers/devices, not guessed.
- At least one complete repeatable gameplay loop is enjoyable before content expansion.
