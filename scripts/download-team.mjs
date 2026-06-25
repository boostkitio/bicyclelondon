// Downloads team headshots from the live site into /public/team/<slug>.jpg.
// Run: node scripts/download-team.mjs

import { mkdirSync, writeFileSync } from "node:fs";

const slugify = (s) =>
  s.replace(/\(.*?\)/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const team = [
  ["Abi Bateman", "5f4cac_b4da40af986f422dbb979c9a56386293~mv2.jpg"],
  ["Aidan Mark", "5f4cac_b1b44718ec6a4271a96ccbc47a15c850~mv2.jpg"],
  ["Alastair Jones", "4308e2_5dbfb47d22bf4214a10160fd602b6127~mv2.jpg"],
  ["Alex Eyles", "5f4cac_db508d4718e043c8bf524138c5aa452b~mv2.jpg"],
  ["Alex Wood", "5f4cac_8b01f511f6c74ea6ad42e8422d21921e~mv2.jpg"],
  ["Alina de Villiers-Hill", "4308e2_d96a8bc13202450da1f581c91d10ee97~mv2.jpg"],
  ["Andres Pico", "5f4cac_5e7b4a3ec4734cf681d8fa5c902abd6e~mv2.jpg"],
  ["Baxter", "061706_bcc17ca80526463d83a98ebce7fda88b~mv2.jpg"],
  ["Becky Gemmell", "95830d_46bcd967634c44109636545c2e16489d~mv2.jpg"],
  ["Becky Gwynne", "5f4cac_e02cef0a74fd4eebb4ce85d16738a325~mv2.jpg"],
  ["Bryan Hogg", "061706_7fabf677a20645b0bfcee75e103896bd~mv2.jpg"],
  ["Carol Middleton", "061706_57a068ce86f6417b941c4a5a6e715774~mv2.jpg"],
  ["Charlotte Wheatley", "061706_d8b6cf5b15c04c86910839e137aae24f~mv2.jpg"],
  ["Chris Ball", "5f4cac_301231c2fc0845c5a71ade8f5172ff5a~mv2.jpg"],
  ["Christina Smith", "4308e2_aeca74cfa26342908a98b007a805fff8~mv2.jpg"],
  ["Connor Dimberline", "4308e2_213ddf6fdb434395a36cc9a75d76940d~mv2.jpg"],
  ["Daisy Graham", "061706_ccee346cbacc4822b6e056b6284524fe~mv2.jpg"],
  ["Daniela Ochoa", "a61267_278a6ba347c64e2fab5b335a45d159c0~mv2.jpg"],
  ["Demi Cumming", "061706_0d7b9e9731784bdeb060417c3d432d34~mv2.jpg"],
  ["Dylan Edwards", "4308e2_09ff1f48953c4a3bb1a3f2494f7ea573~mv2.jpg"],
  ["Dylan Pritchard", "5f4cac_3f5c7ee31a5645fd8ea1a53bba494563~mv2.jpg"],
  ["Eleanor Sibley", "061706_3e2d67076a4f4f74a28e6741842d67a8~mv2.jpg"],
  ["Erika Mari", "061706_8f64a43ec7294651a8f84b87b04f5e2a~mv2.jpg"],
  ["Evie Hutcheon", "061706_d90c5a9456ff4d18bfecced1737508df~mv2.jpg"],
  ["Fred Scriven", "a61267_265e9f4af79e405e86a94df07724d2bc~mv2.jpg"],
  ["Frediano Iannelli", "061706_ce0c52e896bb49079af9599da14d9550~mv2.jpg"],
  ["George Lilley-Moncrieff", "061706_1f27c96458eb450590e8d74bc93800d9~mv2.jpg"],
  ["Georgie Hobley", "061706_ca72f7d59a5e482fbfb69addfe8887c8~mv2.jpg"],
  ["Hana Chowdhury", "a61267_3df50e4660dd4ddd921dd95cd526f70d~mv2.jpg"],
  ["Hannah Saunders", "5f4cac_9e7b4780eb5d474e9af10b227dfe42e1~mv2.jpg"],
  ["Harrison Zhang", "061706_42cee383781f443e90dababb973d44d6~mv2.jpg"],
  ["Henry Daglish", "5f4cac_290aa1c1fe594ca89c547dd757fe4f3b~mv2.jpg"],
  ["Hiten Shah", "4308e2_bd4faecef35b45cbad693cae61abd62d~mv2.jpg"],
  ["Izzy Nott", "5f4cac_c8ebdf9fac764b4c962d5bcd7ba2ca9d~mv2.jpg"],
  ["Jae Rich", "061706_1048932ec5f5401ca9c09dd3ad573c17~mv2.jpg"],
  ["Jim Elliott", "5f4cac_9ef99f8b239548a68d41606dbb7b5887~mv2.jpg"],
  ["Joe Eaton", "5f4cac_592b1b31f52c44f98a87c189537cd26a~mv2.jpg"],
  ["Josh Andrews", "5f4cac_e593b76a3df443a8943e4535b67bcbd3~mv2.jpg"],
  ["Laura Jarvis", "061706_3367e00728954507957302fe26e8bd23~mv2.jpg"],
  ["Lottie Thomas", "a61267_f285d73370f944fa990d832ca37eb032~mv2.jpg"],
  ["Louis Aidam", "5f4cac_e5a8a5a03f82478f8d0b3c4f495b8b94~mv2.jpg"],
  ["Luca Wieynk", "061706_4198fefda60d4891952eebc66f8b277e~mv2.jpg"],
  ["Lucas Miracca", "5f4cac_cb5f667a4f454382ac424beca1008003~mv2.jpg"],
  ["Luna", "a61267_6cb54077488443b5861f62dcc4ac44c3~mv2.jpg"],
  ["Mark Pavlika (Pav)", "061706_6dbf3e67468d4522a75b4e21e98a70d4~mv2.jpg"],
  ["Matt Sharkey", "5f4cac_532bec9df0bd4581a886ea85fc7d73b7~mv2.jpg"],
  ["Mavina Bhatta", "4308e2_b74ba7f6c66049b4b42b61ff07091f5a~mv2.jpg"],
  ["Megan Hume", "4308e2_057a653ef5c34faf9c50f415cc04b82f~mv2.jpg"],
  ["Natalie Jackson", "4308e2_75a4ef106c604e5d8180fb5a4241f7ba~mv2.jpg"],
  ["Nelly", "061706_bfd566093b184bf4993b2bfea5ef3da0~mv2.jpg"],
  ["Ollie Makin", "5f4cac_5e9e1a91df6248a9aea2e5cbb40f73a5~mv2.jpg"],
  ["Ollie Walker", "a61267_820849b6b11d43e0af6f7217747118d6~mv2.jpg"],
  ["Pedro Avery", "5f4cac_e377d3083ba64d2181e2b3b9f625d771~mv2.jpg"],
  ["Poppy Pressland", "061706_164f809da1f546f694bdfae4a717adca~mv2.jpg"],
  ["Quincy Boateng", "5f4cac_13b32563dc684755b85dc8f0d1d7bf3f~mv2.jpg"],
  ["Reema Patel", "5f4cac_d2466bcdd6d14fd4bceb4688e7112bfd~mv2.jpg"],
  ["Richard Cavill", "4308e2_0c232b7860c84c44a50567f44e643cd7~mv2.jpg"],
  ["Rohan Patel", "061706_056e4be90cdb4b43a90b292535748e1f~mv2.jpg"],
  ["Sam Atkinson", "061706_49d100af1db04fbeba8834570237256c~mv2.jpg"],
  ["Sam Staniforth", "061706_9a2182b160d84b0a873f537aae337860~mv2.jpg"],
  ["Sarah Kong", "a61267_dd5a7d03f6744f3782b58c3a6deb5015~mv2.jpg"],
  ["Shivani Patel", "061706_b795568ea8e9404bb016d641f77a9246~mv2.jpg"],
  ["Simone Gayle", "061706_4e9e17fa4e304127a11b37588e3d6335~mv2.jpg"],
  ["Teo Borozan", "5f4cac_d32047e81e244e6aa0bf895215ccb675~mv2.jpg"],
  ["Valeria Perticucci", "061706_aec0b34626344617ad2fe8e0ae53ff00~mv2.jpg"],
  ["Yash Kaushik", "061706_871496c9f4d842518147ef3620a696da~mv2.jpg"],
];

mkdirSync("public/team", { recursive: true });

async function run() {
  let ok = 0;
  for (const [name, id] of team) {
    const slug = slugify(name);
    try {
      const url = `https://static.wixstatic.com/media/${id}/v1/fill/w_600,h_600,al_c,q_80/photo.jpg`;
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      writeFileSync(`public/team/${slug}.jpg`, buf);
      ok++;
    } catch (e) {
      console.error(`✗ ${name}: ${e.message}`);
    }
  }
  console.log(`Downloaded ${ok}/${team.length} headshots.`);
}

run().catch((e) => { console.error(e); process.exit(1); });
