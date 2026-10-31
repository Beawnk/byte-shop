import { onBeforeUnmount } from 'vue';
import { gsap } from 'gsap';

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Staggered enter/leave hooks for a <TransitionGroup :css="false">. Each item needs
// :data-index="index". Tweens run in a gsap.context so leaving the page stops them.
// leaveDuration: 0 removes the old items at once, for lists that are replaced as a whole
// (pagination): old items still leaving would keep their grid cells and push the new ones down.
export function useListAnimation({
	axis = 'x',
	enterFrom = -30,
	enterDuration = 0.5,
	enterStagger = 0.15,
	leaveTo = 30,
	leaveDuration = 0.5,
	leaveStagger = 0.15,
} = {}) {
	const context = gsap.context(() => {});
	const translate = axis === 'y' ? 'translateY' : 'translateX';

	const onBeforeEnter = (el) => {
		if (prefersReducedMotion()) return;
		el.style.opacity = 0;
		el.style.transform = `${translate}(${enterFrom}px)`;
	};

	const onEnter = (el, done) => {
		if (prefersReducedMotion()) {
			done();
			return;
		}

		context.add(() => {
			gsap.fromTo(
				el,
				{ opacity: 0, [axis]: enterFrom },
				{
					opacity: 1,
					[axis]: 0,
					duration: enterDuration,
					delay: parseInt(el.dataset.index) * enterStagger,
					clearProps: 'transform',
					onComplete: done,
				}
			);
		});
	};

	const onLeave = (el, done) => {
		if (!leaveDuration || prefersReducedMotion()) {
			done();
			return;
		}

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
