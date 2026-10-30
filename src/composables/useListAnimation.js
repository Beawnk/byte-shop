import { onBeforeUnmount } from 'vue';
import { gsap } from 'gsap';

// Staggered enter/leave hooks for a <TransitionGroup :css="false">. Each item needs
// :data-index="index". Tweens run in a gsap.context so leaving the page stops them.
export function useListAnimation({
	axis = 'x',
	enterFrom = -30,
	leaveTo = 30,
	leaveDuration = 0.5,
	leaveStagger = 0.15,
} = {}) {
	const context = gsap.context(() => {});
	const translate = axis === 'y' ? 'translateY' : 'translateX';

	const onBeforeEnter = (el) => {
		el.style.opacity = 0;
		el.style.transform = `${translate}(${enterFrom}px)`;
	};

	const onEnter = (el, done) => {
		context.add(() => {
			gsap.fromTo(
				el,
				{ opacity: 0, [axis]: enterFrom },
				{
					opacity: 1,
					[axis]: 0,
					duration: 0.5,
					delay: parseInt(el.dataset.index) * 0.15,
					clearProps: 'transform',
					onComplete: done,
				}
			);
		});
	};

	const onLeave = (el, done) => {
		context.add(() => {
			gsap.to(el, {
				opacity: 0,
				[axis]: leaveTo,
				duration: leaveDuration,
				delay: parseInt(el.dataset.index) * leaveStagger,
				onComplete: done,
			});
		});
	};

	onBeforeUnmount(() => context.revert());

	return { onBeforeEnter, onEnter, onLeave };
}
