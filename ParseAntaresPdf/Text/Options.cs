using System.Collections;
using System.Collections.Generic;

namespace ParseAntaresPdf.Text
{
    public class Options: IEnumerable<Option>
    {
        /*
         * When writing out <option> tags inside <options>, if it finds a match to one of these strings, it will write this string instead of the original one.
         * This converts lines like "Upgrade a Strike Leader to Leader 2" to a simpler string "Leader 2". It also removes all weirdness from the PDF parsing
         * (extra dots, spacing, extra words, etc).
         * 
         * Careful if you re-order these or add new ones.
         * The algorithm runs top to bottom, so if a line matches an earlier option "Trooper" when it should match a later one, it will output wrong.
         * Generally: More general sounding items must be later in the list than more specific items
         */
        private static readonly Option[] List =
        {
            new Option {Name = "increasing  capability", Replacement = "Enhanced Machine Intelligence"}, // the parsing is weird here - the lines don't match up, so this is a hack to cover for it.
            new Option {Name = "kinetic armour", Replacement = "Kinetic Armour"},
            new Option {Name = "or Plasma Pistol instead of Mag Gun", Replacement = "Mag Repeater or Plasma Pistol"},   // as with "increasing  capability" the lines are mismatched, so this line doesn't have the Mag Repeater on it. This is a hack.
            new Option {Name = "Misgenic Abilities"},
            new Option {Name = "Rejects"},
            new Option {Name = "MOD 2 and Res 8(9)"},
            new Option {Name = "Spotter Drone"},
            new Option {Name = "Leader Plasma Pistol"},    // must be above Plasma Pistol
            new Option {Name = "Plasma Pistol"},    // must be above Mag Gun
            new Option {Name = "Mag Guns"},    // must be above Mag Gun
            new Option {Name = "Leader Mag Gun"},
            new Option {Name = "Leader 3"},
            new Option {Name = "Medi-Drone"},
            new Option {Name = "HL Booster"},
            new Option {Name = "Phase Armour"},
            new Option {Name = "Captain a Compression Carbine"},
            new Option {Name = "Bodyguard Compression Carbine"},  // must be above Bodyguard
            new Option {Name = "Bodyguard"},
            new Option {Name = "Gun Drones with Plasma Carbines"},  // must be above Plasma Carbine
            new Option {Name = "Leader Plasma Carbine"},
            new Option {Name = "Plasma Carbine"},
            new Option {Name = "Hyperlight Armour"},    // must be above Impact Cloaks
            new Option {Name = "Impact Cloaks"},
            new Option {Name = "Medi-Probes"},
            new Option {Name = "Reflex Armour"},    // must be below Hyperlight Armour and Phase Armour
            new Option {Name = "Plasma Grenade"},
            new Option {Name = "Soma Grafts"},  // must be above Soma Graft
            new Option {Name = "Soma Graft"},
            new Option {Name = "Renegade Meld"},
            new Option {Name = "Nano Drone"},
            new Option {Name = "Vardanari Guard"},
            new Option {Name = "Feral Fighters"},
            new Option {Name = "Micro-X Launcher"},
            new Option {Name = "Synchoniser Drone"},
            new Option {Name = "Synchroniser Drone"},
            new Option {Name = "SlingNet Ammo"},
            new Option {Name = "Shield Drone"},
            new Option {Name = "Weapon Drone"},
            new Option {Name = "Batter Drone"},
            new Option {Name = "Scrambler, Arc, Blur, Scoot, Net and Grip"},
            new Option {Name = "Scrambler, Arc, Blur, Scoot, Net or Grip"},
            new Option {Name = "X-launcher"},
            new Option {Name = "X-Launcher"},
            new Option {Name = "Fractal Bombard"},  // must be above X-Howitzer
            new Option {Name = "X-Howitzer"},
            new Option {Name = "Mag Mortar"},
            new Option {Name = "Nano-probe Net"},
            new Option {Name = "Self-Repair"},
            new Option {Name = "Self Repair"},
            new Option {Name = "Nano-probes"},
            new Option {Name = "Hound Probe"},
            new Option {Name = "Leader 2"},
            new Option {Name = "Compactor Drone with compacted Plasma Cannon"},
            new Option {Name = "Fractal Cannon"},
            new Option {Name = "Mag Cannon"},
            new Option {Name = "Compression Cannon"},
            new Option {Name = "Plasma Cannon"},
            new Option {Name = "Plasma Bombard"},
            new Option {Name = "Compression Bombard"},
            new Option {Name = "Twin Mag Light Support"},    // must be above Mag Light Support
            new Option {Name = "Mag Light Support"},    // must be above Mag Repeater
            new Option {Name = "Mag Heavy Support"},
            new Option {Name = "Mag Launcher Rack"},
            new Option {Name = "Heavy Mag Cannon"},
            new Option {Name = "Sensor Module"},
            new Option {Name = "Subverter Matrix"},
            new Option {Name = "Scout Probes"},
            new Option {Name = "Targeter Probe"},
            new Option {Name = "Plasma Light Support"},
            new Option {Name = "Compactor Drone"},
            new Option {Name = "Leader"},   // must be below Leader 2 and Leader 3
            new Option {Name = "Freeborn"}, // must be below Leader
            new Option {Name = "Plasma Lance"},
            new Option {Name = "MOD 2"},    // must be at the bottom of the list, this is pretty generic
            new Option {Name = "Trooper"}   // must be at the bottom of the list, this is pretty generic
        };

        public IEnumerator<Option> GetEnumerator()
        {
            return new List<Option>(List).GetEnumerator();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }
    }
}
