# Pokedex
### __Starts development server__
```
npm start
```
# PokéAPI
## Loading Pokémons list
State for: 16.04.2020
### __Overview__
It is a network heavy process due to quantity of calls. Firstly, it retrieves all Pokémon Species that are stored in database. And because of how PokéApi works it is quite a hassle to retrieve it in some optimum way.

So here is the weird workaround:
1) Get info about only one Pokémon Species, to retrieve count of all available pokémons in the smallest possible call.

2) Get all Pokémon Species by setting limit to count retrieved in previous call.

3) Based on page, on which user is, count current offset and load 20 (determined by variable in Home.vue) Pokémons Species.

4) For each retrieved Pokémon Species load first Pokémon variety of them, to get tags and sprites.

#### Logic behind
First, smallest call, allows to omit problem, with getting all Pokémons Species blindly. Which can prevent some bugs and corner cases.

Moving on. There is no real use for built-in pagination on Pokémons Species endpoint. Basically it returns only key-value pairs (pokémon name, url to retrieve full info). So even when getting all of them at once it is still not very network heavy call.

And which is even more important - when we take into account that retrieved Pokémons Species from other endpoints (like habitat, colors or shapes, which are used for filtering) have no pagination at all! 

Having a separate system, that would involve server-side pagination for Pokémons Species without filtering, would only mess up codebase for slight performance improvements.

#### What could be done differently
* Third step of the workaround could be ommited. PokéApi allows to retrieve pokémon by id or name, so it could be immediately retrieved from "pokemon" endpoint by its name. And save almost half of the calls which would be a huge optimalization improvement.

    On the other hand, pokémon species stores info about generations, flavor texts, varieties or even capture rate. There is a potential for these informations to be displayed somewhere in the list in order to create more specific Pokedex.

    For example, info about pokémon generation determines way of rendering pokemon sprites. Newer pokémons have different art style, so they should have different image filtering. Which make them looks slightly better.