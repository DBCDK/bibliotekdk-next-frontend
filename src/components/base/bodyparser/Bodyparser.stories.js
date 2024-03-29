import { StoryTitle, StoryDescription } from "@/storybook";

import BodyParser from "./BodyParser";

const exportedObject = {
  title: "base/BodyParser",
};

export default exportedObject;

/**
 * Returns Bookmark button
 *
 */
export function BasicBodyParser() {
  const body = `<h2>Overskrift 2</h2>  <p>&nbsp;</p>  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget nisl urna. Etiam et volutpat dolor. Quisque eleifend dapibus erat, congue placerat orci vehicula lobortis. Ut mollis, massa ultricies blandit luctus, augue quam feugiat sem, vel efficitur eros eros vel est. Curabitur facilisis iaculis nibh, non lacinia metus auctor eu. Vivamus lobortis metus vitae lacus iaculis, vel gravida leo dictum. Nam vehicula nunc nec vestibulum rutrum. Vestibulum non dapibus lacus. Praesent consectetur sapien felis, at scelerisque magna varius vel. Mauris quis mauris consequat, fermentum nisl sed, vulputate arcu. Nam accumsan finibus auctor. Etiam laoreet, turpis sit amet maximus tristique, diam turpis elementum sem, at tempus urna turpis eu lectus. Ut at tristique tortor, quis blandit libero. Nunc in cursus risus. In eros massa, accumsan sit amet dignissim pellentesque, cursus id risus.<br /> <br /> Prøv google:&nbsp;<a href='https://www.google.dk/'>https://www.google.dk/</a><br /> <br /> <img alt="Læser bog i hængekøje" data-caption="Hængekøje hygge med bog" data-entity-type="file" data-entity-uuid="cd3808c9-dbb5-4734-ad85-27a3267668b9" src="/img/bibdk-hero-scaled.jpeg" /> Praesent quis velit sit amet orci tincidunt imperdiet. Proin odio turpis, laoreet nec mattis et, elementum in massa. Donec vehicula a nulla vitae volutpat. Proin varius eget neque ut laoreet. Sed sed felis vestibulum, dignissim quam eget, auctor purus. Ut quis ipsum tempus, accumsan elit non, blandit nisi. Vivamus auctor ipsum condimentum, posuere nisl at, fermentum dui. Vestibulum enim dolor, commodo at commodo ut, pretium aliquam lectus. Duis mattis orci lectus, eget lobortis nisi rhoncus a. Suspendisse condimentum magna eget lorem tristique, ut euismod leo tempus. Maecenas id ante tincidunt, ultricies velit in, porta erat. Quisque a ipsum sit amet eros sollicitudin posuere. Nam nisi leo, accumsan vel dictum vitae, rutrum vitae enim.<br /> Nulla eu ante lobortis, luctus odio sed, molestie nunc. Fusce ut commodo felis. Nam iaculis sollicitudin ligula non iaculis. Pellentesque et est dictum felis lacinia pellentesque. Curabitur tellus justo, ullamcorper in lacus sed, dapibus feugiat neque. Sed efficitur nunc eu arcu rutrum tristique. Nullam vel ligula venenatis, tincidunt quam ut, tincidunt metus.<br /> &nbsp;</p>  <ul> 	<li> 	<p>punkt 1</p> 	</li> 	<li> 	<p>punkt 2</p> 	</li> 	<li> 	<p>punkt 3</p> 	</li> 	<li> 	<p>punkt 4</p> 	</li> </ul>  <p>&nbsp;</p>  <h3>Overskrift 3</h3>  <p><br /> Sed sodales dictum lacinia. Duis molestie tortor magna, ac sagittis nibh dignissim ut. Etiam vel suscipit nisl. Nullam eu est nec libero tincidunt facilisis posuere id arcu. Sed bibendum pretium augue, a volutpat neque placerat sed. Sed orci sapien, ullamcorper at mauris nec, commodo maximus est. Donec eget nunc nec leo ornare elementum. Curabitur sagittis, nulla vel pretium malesuada, nisl odio dapibus ante, at convallis enim neque id felis. Nullam velit nisl, vulputate quis lectus ac, vehicula consectetur neque. Nam commodo elementum turpis, vel rutrum est. Donec iaculis iaculis porttitor. Morbi at condimentum ligula. Cras suscipit gravida diam, sit amet venenatis risus sollicitudin at.<br /> <br /> <em><strong>Den er italic</strong></em></p>  <ol> 	<li>Første prioritet</li> 	<li>Anden prioritet</li> 	<li>Tredje prioritet</li> </ol>  <p><br /> Pellentesque varius tincidunt egestas. Vivamus rutrum accumsan arcu in auctor. Cras justo eros, dignissim vel ullamcorper rhoncus, posuere ac orci. Sed vulputate turpis id odio ultrices, id eleifend tellus viverra. Donec et dapibus ipsum. Maecenas blandit dictum interdum. In ac urna lectus. Curabitur euismod leo at sem congue, vel auctor velit congue. Pellentesque eros nibh, aliquam vel justo non, imperdiet cursus mi. Duis vitae porttitor leo, non sodales nibh. Aliquam nec consectetur quam. Aliquam erat volutpat. Mauris accumsan cursus massa eu tempor. Praesent a mi turpis. Phasellus sit amet justo id leo ultrices dapibus.</p>  <h4>&nbsp;</h4>  <h4>Overskrift 4<br /> <br /> <strong>Den er fed</strong><br /> <br /> Pellentesque varius tincidunt egestas. Vivamus rutrum accumsan arcu in auctor. Cras justo eros, dignissim vel ullamcorper rhoncus, posuere ac orci. Sed vulputate turpis id odio ultrices, id eleifend tellus viverra. Donec et dapibus ipsum. Maecenas blandit dictum interdum. In ac urna lectus. Curabitur euismod leo at sem congue, vel auctor velit congue. Pellentesque eros nibh, aliquam vel justo non, imperdiet cursus mi. Duis vitae porttitor leo, non sodales nibh. Aliquam nec consectetur quam. Aliquam erat volutpat. Mauris accumsan cursus massa eu tempor. Praesent a mi turpis. Phasellus sit amet justo id leo ultrices dapibus.</h4>  <h4><br /> &nbsp;</h4>`;
  return (
    <div>
      <StoryTitle>BodyParser</StoryTitle>
      <StoryDescription>
        The BodyParser component allows us to embed a HTML string from a trusted
        source (the Drupal backend) and apply our styles to it.
      </StoryDescription>
      <BodyParser body={body} />
    </div>
  );
}

/**
 * Returns Bookmark button
 *
 */
export function BodyParserSkeleton() {
  return (
    <div>
      <StoryTitle>BodyParser</StoryTitle>
      <StoryDescription>Skeleton</StoryDescription>
      <BodyParser skeleton={true} />
    </div>
  );
}
