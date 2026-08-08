/* Transition scenes — full-screen cinematic cards the GM plays between beats.
   kicker/title appear over the art; `narration` is written to be READ ALOUD,
   radio-drama style. `sound` fires automatically: {shot} plays once,
   {loop} starts with the scene and stops when it closes. */

const SCENES = [
  {
    id: "cold-open",
    kicker: "A PINEBROOK STORY",
    title: "They Were Here",
    sound: { loop: "crickets" },
    narration:
      "Pinebrook. Population eight thousand two hundred and thirteen. Two churches, one diner, " +
      "forty-one thousand square feet of regulation-height lawn. The kind of town where the biggest " +
      "news in a decade was the roundabout. Where every porch light comes on at dusk like the town " +
      "is checking its own pulse. Nothing happens here. Nothing has ever happened here. " +
      "Keep telling yourself that. It helps."
  },
  {
    id: "act-one",
    kicker: "ACT ONE",
    title: "The Night It Happened",
    sound: { loop: "hum" },
    narration:
      "It's a Tuesday. It has the audacity to be a Tuesday. The dishwasher is running its little " +
      "heart out, the fridge hums in B-flat, and somewhere down Marigold Lane a dog barks twice " +
      "and thinks better of it. You are awake — you know why you're awake, even if you've never " +
      "told anyone — and the clock on your nightstand reads 2:46. " +
      "In one minute, everything you know about your street stops being true."
  },
  {
    id: "abduction",
    kicker: "2:47 AM",
    title: "The Light Over Marigold Lane",
    sound: { shot: "beam" },
    narration:
      "The hum arrives through the floor, through your teeth, through the part of your brain that " +
      "remembers being an animal. Light pours through the blinds — cyan, patient, polite, like the " +
      "world's friendliest police raid. And out there, over the Hendersons' begonias, Gary Henderson " +
      "is rising into the sky in his bathrobe. He is holding a garden gnome. He looks mildly " +
      "inconvenienced, the way he looks when the recycling truck is late. He does not scream. " +
      "The light snaps off. The street exhales. And the grass where he stood is warm."
  },
  {
    id: "mandatory-fun",
    kicker: "ACT ONE · FINALE",
    title: "Mandatory Fun",
    sound: { shot: "doorbell" },
    narration:
      "It's under your door in the morning. It's under every door — you can see them from the porch, " +
      "little white tongues sticking out of every house on the street. Heavy cardstock. Smells faintly " +
      "of pickle brine. 'NEIGHBORHOOD IMPROVEMENT ASSOCIATION. BLOCK PARTY — SATURDAY. ATTENDANCE WILL " +
      "BE TAKEN. Games! Prizes! Jell-O! Please verify you are having fun.' " +
      "There is no RSVP. There is no need. They know where you live. They are your neighbors."
  },
  {
    id: "act-two",
    kicker: "ACT TWO",
    title: "Welcome to the Neighborhood",
    sound: { loop: "hum" },
    narration:
      "The town is still the town. That's the horrible part. The waffles at Duke's still taste like " +
      "waffles, the sprinklers still run at seven — but Mrs. Abernathy waters her plastic flowers now, " +
      "and the mailman has too many teeth, and yesterday the entire Ruiz family laughed at the same " +
      "joke two full seconds too late, in unison, like an orchestra tuning. You've started counting " +
      "the garden gnomes. There are more of them every morning. They're all facing the street. " +
      "No — check again. They're all facing you."
  },
  {
    id: "the-offer",
    kicker: "A CUL-DE-SAC CONSULTATION",
    title: "Lemonade with Mr. Crisp",
    sound: { shot: "doorbell" },
    narration:
      "The invitation is handwritten. Real handwriting — you can tell somebody practiced. Two wicker " +
      "chairs on a porch that has never once been sat on. A pitcher of lemonade, beading in the heat. " +
      "Real lemonade — he researched it. He has been practicing being a person all week, and he has " +
      "been practicing for you. Mr. Crisp pours two glasses. Tastes his. And for exactly one second, " +
      "he looks surprised. 'SOUR,' he says. 'AND YET.' Then he folds his hands, and the porch gets " +
      "very quiet. 'THE OTHER RESIDENTS WATCH TELEVISION. YOU — YOU WATCH THE STREET. LET US TALK, " +
      "WATCHER TO WATCHER.'"
  },
  {
    id: "undermart",
    kicker: "BENEATH FRESHMART",
    title: "Comfort: Maximum",
    sound: { shot: "sting" },
    narration:
      "The freight elevator opens onto a cathedral of soft blue light. Rows of pods, dozens of them, " +
      "each one glowing like a night-light, each one holding a neighbor. There's Gary, still holding " +
      "the gnome. There's Sheriff Marsh, frowning at a dream. Someone has given each of them a blanket. " +
      "Someone has left a mint on each pillow. A sign on the wall, in cheerful municipal lettering, " +
      "reads: GUESTS: FORTY-SEVEN. COMFORT: MAXIMUM. RETURN DATE — and here the letters simply stop."
  },
  {
    id: "act-three",
    kicker: "ACT THREE",
    title: "Founders' Day",
    sound: { loop: "crickets" },
    narration:
      "Founders' Day dawns perfect, because of course it does. Bunting on every fence. A marching band " +
      "tuning up by the gazebo. Three hundred folding chairs in rows so straight they look plotted by " +
      "laser — because they were. Mr. Crisp stands at the podium testing the microphone: 'ONE. TWO. " +
      "ONE. TWO. ONE. TWO.' He has been testing it for forty minutes. Tonight there will be fireworks. " +
      "Tonight the tower sings. You have until the streetlights come on to save every soul in Pinebrook — " +
      "and you're going to need more salt."
  },
  {
    id: "unzip",
    kicker: "THE OVERSEER",
    title: "Mr. Crisp Would Like a Word",
    sound: { shot: "sting" },
    narration:
      "Crisp stops mid-sentence. Not startled — scheduled, like a calendar reminder just went off " +
      "somewhere inside him. He sets down the microphone. He smooths his tie. He says, 'I HAD HOPED " +
      "TO DO THIS THE NEIGHBORLY WAY.' And then Mr. Crisp reaches up behind his own neck, and politely, " +
      "carefully — the way you'd take off a sweater your grandmother knitted — he begins to unzip. " +
      "What comes out is green, and vast, and it is still, somehow, smiling."
  },
  {
    id: "ending-treaty",
    kicker: "EPILOGUE",
    title: "The Treaty of Pinebrook",
    sound: null,
    narration:
      "The Collective is mortified. All of it, all at once — forty thousand ships blushing in unison " +
      "somewhere past the moon. 'WE HAVE BEEN... RUDE?' it says, in a voice like a casserole apologizing. " +
      "The pods open with a sound like soda cans. The lawns get re-sodded overnight, properly this time. " +
      "And at the end of Marigold Lane there is now one — exactly one — perfect house, where the " +
      "politest beings in the galaxy live quietly, take excellent care of their gutters, and wave at you " +
      "every single morning. You wave back. It's the neighborly thing to do."
  },
  {
    id: "ending-boom",
    kicker: "EPILOGUE",
    title: "The Big Boom",
    sound: { shot: "beam" },
    narration:
      "The tower goes up like the Fourth of July finally telling the truth. Salt rains down Main Street, " +
      "hissing where it lands, and the great signal dies mid-syllable — ALL IS REA— and then nothing. " +
      "Silence. Crickets. Real ones. Far above, a fleet of forty thousand ships checks its reservation, " +
      "finds it cancelled, and reroutes — somewhere in Ohio, a lawn is about to become very suddenly " +
      "perfect, and that is officially not your problem. Gary hugs you. He never lets go of the gnome. " +
      "You never ask."
  },
  {
    id: "perfected",
    kicker: "EPILOGUE · ?",
    title: "Pinebrook, Perfected",
    sound: { loop: "hum" },
    narration:
      "One year later, Pinebrook wins Friendliest Town in the Tri-County Area. For real, this time — " +
      "the trophy is already engraved. Everyone smiles. Everyone waves. Every lawn is the same height " +
      "to the millimeter, and nobody remembers why that used to feel wrong. At 2:47 every morning the " +
      "whole town hums, one note, together, like a choir breathing in. And if you're still out there — " +
      "still human, still keeping the old kind of time — then you're the only one who remembers. " +
      "They were here. They stayed."
  }
];
