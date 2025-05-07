## 'Thaumcraft 4' inspired mini-game! *

[Click here to run!](https://gar018.github.io/thaumcraft-research-minigame/thaum.html)

(Built on Github Pages)

\* Currently have not implemented a minigame, but rather a GUI demo due to time constraints for the class project. I do plan on further working on this after the end of this class, so the name will stay until then.

## Overview

Thaumcraft 4 is a Minecraft mod created by [Azanor](https://github.com/Azanor). This mod introduces magical properties to blocks and items known as 'aspects', which you can further break down and manipulate these aspects intro more simple and complex components. This mod's research minigame is what this project is inspired by.

In this minigame you are tasked with completing a puzzle within a scroll provided to you by your quest book in-game. The puzzle asks you to connect two or more elements known as ‘aspects’ together by creating a sequence of aspects that share a common aspect between each adjacent link. In the reference image seen above, the scroll you are tasked with asks to link the ‘Lux’ aspect (the bottom left candle icon) with the ‘Ignis’ aspect (the top right flame icon). It is important to note that Ignis and ‘Aer’ (the swirling icon) are primal aspects. These aspects are like primary colors, and are not the result of two other colors/aspects. Lux, however, is a compound aspect of Ignis and Aer, similar to the idea that orange is a mix of red and yellow. Each connected aspect has a relationship to each other. Reading the scroll from left to right: Lux is composed of Ignis, Ignis comprises Lux, Lux is composed of Aer, Aer comprises Lux, and finally Lux is composed of Ignis.

Icons are from [https://game-icons.net](https://game-icons.net).

Background asset (greatwood planks) is from Thaumcraft 4.

## Individual Reflection:

This project did not go as I had planned. The first week of development I had a lot more free time to work, but as other classes started concluding their assignments & my senior design, the amount of time I had to work on the project sharply declined. A lot of the work went into CSS research, which was necessary for adding features like removing color interpolation (what makes image previews look so blurry) from the fragment shaders for the aspect and background images. Another was making sure that my source code was as reusable as possible. This means that while I had greatly fallen back on my goals for the project, I had avoided creating a rigid code structure that would prevent me from creating a more complex scene in the future.