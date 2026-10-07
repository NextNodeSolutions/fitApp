import { describe, expect, it } from 'vitest'

import {
	buildDaySummary,
	calorieStatus,
	computeBmr,
	computeDailyCalorieTarget,
	computeMacroTargets,
	computeTdee,
	macroRemainingMessage,
	sumNutrition,
	totalsByDay,
} from './index'

describe('energy needs', () => {
	it('computes a male BMR and moderate TDEE with Mifflin-St Jeor', () => {
		// 10 x 80 + 6.25 x 180 - 5 x 30 + 5 = 1780 ; 1780 x 1.55 = 2759
		const bmr = computeBmr({
			weightKg: 80,
			heightCm: 180,
			age: 30,
			sex: 'male',
		})
		expect(bmr).toBe(1780)
		expect(computeTdee(bmr, 'moderate')).toBe(2759)
	})

	it('computes a female BMR and sedentary TDEE with Mifflin-St Jeor', () => {
		// 10 x 60 + 6.25 x 165 - 5 x 25 - 161 = 1345.25 ; 1345 x 1.2 = 1614
		const bmr = computeBmr({
			weightKg: 60,
			heightCm: 165,
			age: 25,
			sex: 'female',
		})
		expect(bmr).toBe(1345)
		expect(computeTdee(bmr, 'sedentary')).toBe(1614)
	})

	it('targets maintenance calories from the profile', () => {
		const profile = {
			height: 180,
			age: 30,
			sex: 'male',
			activityLevel: 'moderate',
		} as const
		expect(computeDailyCalorieTarget(profile, 80)).toBe(2759)
	})
})

describe('computeMacroTargets', () => {
	it('splits the target into protein, fat and remaining carbs', () => {
		// P 160 g (640 kcal), F 64 g (576 kcal), C (2759 - 1216) / 4 = 385.75
		expect(computeMacroTargets(2759, 80)).toEqual({
			proteinG: 160,
			carbsG: 386,
			fatG: 64,
		})
	})

	it('keeps every goal inside a very small target, protein first', () => {
		// Sedentary woman, 80 y, 30 kg, 100 cm: 437 kcal. P 60 g (240 kcal), then
		// F (437 - 240) / 9 = 21.9 g instead of 24 g, nothing left for carbs.
		const target = computeDailyCalorieTarget(
			{ height: 100, age: 80, sex: 'female', activityLevel: 'sedentary' },
			30,
		)
		expect(target).toBe(437)
		expect(computeMacroTargets(target, 30)).toEqual({
			proteinG: 60,
			carbsG: 0,
			fatG: 22,
		})
	})

	it('caps protein at the whole target when it alone exceeds it', () => {
		expect(computeMacroTargets(1000, 150)).toEqual({
			proteinG: 250,
			carbsG: 0,
			fatG: 0,
		})
	})
})

describe('calorieStatus', () => {
	it('is a deficit below target minus 50 kcal', () => {
		expect(calorieStatus(1949, 2000)).toBe('deficit')
	})

	it('is balanced within 50 kcal of the target, bounds included', () => {
		expect(calorieStatus(1950, 2000)).toBe('balance')
		expect(calorieStatus(2050, 2000)).toBe('balance')
	})

	it('is a surplus above target plus 50 kcal', () => {
		expect(calorieStatus(2051, 2000)).toBe('surplus')
	})
})

describe('nutrition totals', () => {
	const entries = [
		{
			entryDate: '2026-10-06',
			calories: 100.4,
			proteinG: 0.1,
			carbsG: 10,
			fatG: 1,
		},
		{
			entryDate: '2026-10-07',
			calories: 200.2,
			proteinG: 0.2,
			carbsG: 5.56,
			fatG: 0,
		},
		{
			entryDate: '2026-10-07',
			calories: 300.4,
			proteinG: 0.1,
			carbsG: 0,
			fatG: 2.5,
		},
	]

	it('sums every entry, kcal as integer and grams to one decimal', () => {
		expect(sumNutrition(entries)).toEqual({
			calories: 601,
			proteinG: 0.4,
			carbsG: 15.6,
			fatG: 3.5,
		})
	})

	it('returns zeros for an empty day', () => {
		expect(sumNutrition([])).toEqual({
			calories: 0,
			proteinG: 0,
			carbsG: 0,
			fatG: 0,
		})
	})

	it('groups totals by entry date', () => {
		expect(totalsByDay(entries)).toEqual({
			'2026-10-06': { calories: 100, proteinG: 0.1, carbsG: 10, fatG: 1 },
			'2026-10-07': {
				calories: 501,
				proteinG: 0.3,
				carbsG: 5.6,
				fatG: 2.5,
			},
		})
	})
})

describe('macroRemainingMessage', () => {
	it('tells how many grams are missing, rounded up', () => {
		expect(macroRemainingMessage('Protéines', 129.6, 160)).toBe(
			'Il te manque 31 g de protéines',
		)
	})

	it('reports a reached target', () => {
		expect(macroRemainingMessage('Lipides', 64, 64)).toBe(
			'Objectif lipides atteint',
		)
	})

	it('returns null without a target', () => {
		expect(macroRemainingMessage('Glucides', 10, 0)).toBeNull()
	})
})

describe('buildDaySummary', () => {
	it('sums the day and measures it against the targets', () => {
		const summary = buildDaySummary(2200, 70, [
			{ calories: 900, proteinG: 50, carbsG: 100, fatG: 30 },
			{ calories: 550, proteinG: 32, carbsG: 70, fatG: 18 },
		])
		expect(summary.consumed.calories).toBe(1450)
		expect(summary.status).toBe('deficit')
		expect(summary.remainingMessage).toBe('Il te reste 750 kcal')
		expect(summary.macros.map(macro => macro.targetG)).toEqual([
			140, 284, 56,
		])
	})
})
