import React from "react";
import { TablesOfContents } from "./Contents";

export default {
  title: "Work/Contents",
  component: TablesOfContents,
  parameters: {
    docs: {
      description: {
        component:
          "Shows complete table of contents with hierarchical structure using manifestationContents API",
      },
    },
  },
};

const Template = (args) => <TablesOfContents {...args} />;

export const Default = Template.bind({});
Default.args = {
  contents: [
    {
      heading: "Indholdsfortegnelse",
      entries: [
        {
          title: { display: "Kapitel 1: Introduktion" },
          creators: {
            persons: [{ display: "John Doe" }],
            corporations: [],
          },
          contributors: ["Redigeret af Jane Smith", "Illustreret af Tom Brown"],
          playingTime: "15 min",
          sublevel: [
            {
              title: { display: "1.1 Baggrund" },
              contributors: ["Forsker A", "Forsker C"],
              playingTime: "5 min",
              sublevel: [
                {
                  title: { display: "1.1.1 Historisk kontekst" },
                  contributors: ["Historiker D"],
                  playingTime: "2 min",
                },
                {
                  title: { display: "1.1.2 Historisk kontekst 2" },
                  contributors: ["Historiker D"],
                  playingTime: "3 min",
                },
              ],
            },
            {
              title: { display: "1.2 Metode" },
              contributors: ["Forsker B"],
              playingTime: "10 min",
            },
          ],
        },
        {
          title: { display: "Kapitel 2: Hovedresultater" },
          creators: {
            persons: [{ display: "Alice Johnson" }],
            corporations: [{ display: "Forskningsinstitut" }],
          },
          contributors: ["Statistikker af Data Team"],
          playingTime: "25 min",
          sublevel: [
            {
              title: { display: "2.1 Kvantitative resultater" },
              contributors: ["Analytiker E"],
              playingTime: "15 min",
            },
            {
              title: { display: "2.2 Kvalitative resultater" },
              contributors: ["Forsker F", "Forsker G"],
              playingTime: "10 min",
            },
          ],
        },
        {
          title: { display: "Kapitel 3: Konklusion" },
          creators: {
            persons: [{ display: "Bob Wilson" }],
            corporations: [],
          },
          contributors: ["Gennemgået af Peer Review"],
          playingTime: "8 min",
          sublevel: [
            {
              title: { display: "3.1 Konklusion" },
              contributors: ["Forsker H"],
              playingTime: "8 min",
              sublevel: [
                {
                  title: { display: "3.1.1 Konklusion 1" },
                  contributors: ["Forsker I"],
                  playingTime: "4 min",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const Empty = Template.bind({});
Empty.args = {
  contents: null,
};

export const SingleLevel = Template.bind({});
SingleLevel.args = {
  contents: [
    {
      heading: "Indhold",
      entries: [
        {
          title: { display: "Første kapitel" },
          contributors: ["Forfatter A"],
          playingTime: "10 min",
        },
        {
          title: { display: "Andet kapitel" },
          contributors: ["Forfatter B", "Redaktør C"],
          playingTime: "15 min",
        },
        {
          title: { display: "Tredje kapitel" },
          contributors: ["Forfatter D"],
          playingTime: "12 min",
        },
      ],
    },
  ],
};
