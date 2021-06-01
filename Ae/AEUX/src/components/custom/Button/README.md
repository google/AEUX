# Button

## Styles

<div class="centered"><iframe style="overflow: scroll;" width="440" height="280" seamless frameborder="0" scrolling="yes" src="https://brutalism.netlify.app/#/buttons/button/styles"> </iframe></div>

```html
<Fold label="Styles" :open="true">
  <Row>
    <Button label="Normal" />
    <Button primary>Primary</Button>
    <Button flat label="Flat" />
    <Button filled label="Filled" />
    <Button disabled>Disabled</Button>
    <Button>
      <Icon name="account-circle" />
      <div>With Slot content</div>
    </Button>
    <Button label="Tall" tall />
    <Button toolbar>
      <svg fill="none" viewBox="0 0 24 24">
        <path d="M7 3V2h4v1L9.667 5H8.333L7 3z" />
        <path
          fill-rule="evenodd"
          d="M20 16h-2v2h-2v2h2v2h2v-2h2v-2h-2v-2z"
          clip-rule="evenodd"
        />
      </svg>
    </Button>
  </Row>
  <Button block label="Block button (fill horizontal space)"/>
</Fold>
```

## Props and Events

<div class="centered"><iframe style="overflow: scroll;" width="440" height="360" seamless frameborder="0" scrolling="yes" src="https://brutalism.netlify.app/#/buttons/button/props"> </iframe></div>

```html
<Fold label="Props" :open="true">
	<Row>
		<Button label="Button label" />
		<Button bg="#389672">bg="#389672"</Button>
		<Button color="#46a0f2" label='color="#46a0f2"' />
		<Button label='icon="mdi-account"' icon="mdi-account" />
		<Button label='prefix-icon="mdi-account"' prefix-icon="mdi-account" />
		<Button icon="mdi-settings" icon-size="10px" label='icon-size="10px"' />
		<Button tooltip="I'm a tooltip">tooltip="I'm a tooltip"</Button>
		<Button uppercase label="uppercase" />
		<Button goto="https://battleaxe.co" label='goto="https://battleaxe.co"'/>
		<Button margin="10px">margin="10px"</Button>
		<Button height="30px">height="30px"</Button>
		<Button block left>block left</Button>
		<Button block right>block right</Button>				
	</Row>
</Fold>

<Fold label="Events" :open="true">
  <Button @click="testClick" label='@click="testClick"' />
</Fold>
```