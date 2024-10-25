<script setup lang="ts">
definePageMeta({
	middleware: ["auth", "unfinished-setup"],
});

const { user } = useUserSession();

const name = ref(user.value?.name);
const bio = ref("");
const location = ref("");

const experience_level = ref(0);
const availability = ref(0);

const skills: Ref<string[]> = ref([]);
const tech_stack: Ref<string[]> = ref([]);
const interests: Ref<string[]> = ref([]);
const match_user = ref(true);
const match_project = ref(true);

const skillsInput = ref("");
const techStackInput = ref("");
const interestsInput = ref("");

const experienceText = computed(() => expColumns[experience_level.value - 1]?.text || "");
const availabilityText = computed(() => availColumns[availability.value - 1]?.text || "");

const { isSupported, orientation } = useScreenOrientation();

// TODO: @josh is this a good way to check for mobile?
const isMobile = computed(
	() =>
		isSupported.value &&
		(orientation.value === "portrait-primary" ||
			orientation.value === "portrait-secondary"),
);

const activeStep = ref(0);

const showExperiencePicker = ref(false);
const showAvailabilityPicker = ref(false);

const expColumns = [
	{
		text: "Beginner",
		value: 1,
	},
	{
		text: "Intermediate",
		value: 2,
	},
	{
		text: "Expert",
		value: 3,
	},
];
const availColumns = [
	{
		text: "Volunteer",
		value: 1,
	},
	{
		text: "Part-time",
		value: 2,
	},
	{
		text: "Full-time",
		value: 3,
	},
];
interface OnConfirmOptions {
	selectedOptions: { value: number; text: string }[];
}
const onConfirm = ({ selectedOptions }: OnConfirmOptions) => {
	const selectedValue = selectedOptions[0]?.value;
	if (showExperiencePicker.value) {
		if (selectedValue) experience_level.value = selectedValue;
		showExperiencePicker.value = false;
	} else if (showAvailabilityPicker.value) {
		if (selectedValue) availability.value = selectedValue;
		showAvailabilityPicker.value = false;
	}
};

const router = useRouter();
const handleSubmit = async () => {
	if (!user.value) return;
	console.log("submitting");

	await $fetch("/api/user", {
		method: "POST",
		body: JSON.stringify({
			name: name.value,
			bio: bio.value,
			location: location.value,
			experience_level: experience_level.value,
			availability: availability.value,
			skills: skills.value,
			tech_stack: tech_stack.value,
			interests: interests.value,
			match_user: match_user.value,
			match_project: match_project.value,
		}),
	});
	router.push("/app/");
};
</script>
]
<template>
	<div
		class="flex min-h-screen animate-fade-in flex-col items-center justify-center gap-8 [duration:1.5s]"
	>
		<div>Hi, {{ user?.name.split(" ")[0] }}. Let's get you set up.</div>

		<div class="flex w-full max-w-lg animate-fade-in flex-col gap-4 [duration:3s]">
			<div :class="isMobile ? '' : 'mx-4'">
				<van-steps :active="activeStep" :class="isMobile ? '' : 'rounded-lg'">
					<van-step>Basic Information</van-step>
					<van-step>Professional Details</van-step>
					<van-step>Skills & Interests</van-step>
				</van-steps>
			</div>

			<van-form @submit="activeStep === 2 ? handleSubmit() : activeStep++">
				<template v-if="activeStep === 0">
					<van-cell-group inset>
						<van-field
							v-model="name"
							name="Name"
							label="Name"
							placeholder="John Doe"
							:rules="[{ required: true, message: 'Name is required' }]"
						/>
						<van-field
							v-model="bio"
							name="Bio"
							label="Bio"
							type="textarea"
							rows="2"
							autosize
							placeholder="Tell us about yourself"
						/>
						<van-field
							v-model="location"
							name="Location"
							label="Location"
							placeholder="City, Country"
						>
						</van-field>
					</van-cell-group>
				</template>

				<template v-else-if="activeStep === 1">
					<van-cell-group inset>
						<van-field
							v-model="experienceText"
							is-link
							readonly
							label="Experience Level"
							placeholder="Select"
							:rules="[
								{
									required: true,
									message: 'Experience level is required',
								},
							]"
							@click="showExperiencePicker = true"
						/>
						<van-popup
							v-model:show="showExperiencePicker"
							round
							:position="isMobile ? 'bottom' : 'center'"
							:style="
								isMobile
									? undefined
									: { width: '100%', maxWidth: '400px' }
							"
						>
							<van-picker
								title="Experience Level"
								:columns="expColumns"
								@cancel="showExperiencePicker = false"
								@confirm="onConfirm"
							/>
						</van-popup>
						<van-field
							v-model="availabilityText"
							is-link
							readonly
							label="Availability"
							placeholder="Select"
							:rules="[
								{ required: true, message: 'Availability is required' },
							]"
							@click="showAvailabilityPicker = true"
						/>
						<van-popup
							v-model:show="showAvailabilityPicker"
							round
							:position="isMobile ? 'bottom' : 'center'"
							:style="
								isMobile
									? undefined
									: { width: '100%', maxWidth: '400px' }
							"
						>
							<van-picker
								title="Availability"
								:columns="availColumns"
								@cancel="showAvailabilityPicker = false"
								@confirm="onConfirm"
							/>
						</van-popup>
					</van-cell-group>
				</template>

				<template v-else-if="activeStep === 2">
					<van-cell-group inset>
						<van-field
							v-model="skillsInput"
							name="Skills"
							maxlength="20"
							label="Skills"
							@blur="
								skillsInput && skills.push(skillsInput);
								skillsInput = '';
							"
							@update:model-value="
								if (skillsInput.includes(',')) {
									const input = skillsInput.split(',')[0]?.trim();
									if (input) {
										skills.push(input);
									}
									skillsInput = '';
								}
							"
						>
							<template v-if="skillsInput" #button>
								<van-button
									size="small"
									type="primary"
									native-type="button"
									@click="
										skillsInput && skills.push(skillsInput);
										skillsInput = '';
									"
									>Add</van-button
								>
							</template>
							<template #extra>
								<div class="ml-2 flex max-w-32 flex-wrap gap-1">
									<van-tag
										v-for="skill in skills"
										:key="skill"
										size="medium"
										:closeable="true"
										@close="skills.splice(skills.indexOf(skill), 1)"
									>
										{{ skill }}
									</van-tag>
								</div>
							</template>
						</van-field>

						<van-field
							v-model="techStackInput"
							name="Tech stack"
							maxlength="20"
							label="Tech stack"
							@blur="
								techStackInput && tech_stack.push(techStackInput);
								techStackInput = '';
							"
							@update:model-value="
								if (techStackInput.includes(',')) {
									const input = techStackInput.split(',')[0]?.trim();
									if (input) {
										tech_stack.push(input);
									}
									techStackInput = '';
								}
							"
						>
							<template v-if="techStackInput" #button>
								<van-button
									size="small"
									type="primary"
									native-type="button"
									@click="
										techStackInput && tech_stack.push(techStackInput);
										techStackInput = '';
									"
									>Add</van-button
								>
							</template>
							<template #extra>
								<div class="ml-2 flex max-w-32 flex-wrap gap-1">
									<van-tag
										v-for="tech in tech_stack"
										:key="tech"
										size="medium"
										:closeable="true"
										@close="
											tech_stack.splice(tech_stack.indexOf(tech), 1)
										"
									>
										{{ tech }}
									</van-tag>
								</div>
							</template>
						</van-field>

						<van-field
							v-model="interestsInput"
							name="Interests"
							maxlength="20"
							label="Interests"
							@blur="
								interestsInput && interests.push(interestsInput);
								interestsInput = '';
							"
							@update:model-value="
								if (interestsInput.includes(',')) {
									const input = interestsInput.split(',')[0]?.trim();
									if (input) {
										interests.push(input);
									}
									interestsInput = '';
								}
							"
						>
							<template v-if="interestsInput" #button>
								<van-button
									size="small"
									type="primary"
									native-type="button"
									@click="
										interestsInput && interests.push(interestsInput);
										interestsInput = '';
									"
									>Add</van-button
								>
							</template>
							<template #extra>
								<div class="ml-2 flex max-w-32 flex-wrap gap-1">
									<van-tag
										v-for="intrst in interests"
										:key="intrst"
										size="medium"
										:closeable="true"
										@close="
											interests.splice(interests.indexOf(intrst), 1)
										"
									>
										{{ intrst }}
									</van-tag>
								</div>
							</template>
						</van-field>

						<van-field name="Match" label="Match with">
							<template #input>
								<div class="flex items-center gap-4">
									<div class="flex items-center gap-1">
										<van-switch v-model="match_user" /> Users
									</div>
									<div class="flex items-center gap-1">
										<van-switch v-model="match_project" /> Projects
									</div>
								</div>
							</template>
						</van-field>
					</van-cell-group>
				</template>

				<div class="m-4">
					<van-button
						round
						block
						:type="activeStep === 2 ? 'primary' : 'default'"
						native-type="submit"
						class="animate-fade-in [duration:3s]"
					>
						{{ activeStep === 2 ? "Submit" : "Next" }}
					</van-button>
				</div>
			</van-form>
		</div>
	</div>
</template>
