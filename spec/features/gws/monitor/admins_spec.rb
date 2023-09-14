require 'spec_helper'

describe "gws_monitor_admins", type: :feature, dbscope: :example do
  let(:site) { gws_site }
  let(:g1) { create(:gws_group, name: "#{site.name}/g-#{unique_id}") }
  let(:g2) { create(:gws_group, name: "#{site.name}/g-#{unique_id}") }
  let(:item1) do
    create(
      :gws_monitor_topic, attend_group_ids: [g1.id, g2.id], state: 'public', article_state: 'open', spec_config: 'my_group',
      answer_state_hash: { g1.id.to_s => "answered", g2.id.to_s => "preparation" }
    )
  end

  context "with auth" do
    before { login_gws_user }

    it "#index" do
      item1
      visit gws_monitor_admins_path(site)
      expect(page).to have_content(item1.name)
      expect(page).to have_content("#{I18n.t('gws/monitor.topic.answer_state')}(1/2)")
    end

    it "#new" do
      visit new_gws_monitor_admin_path(site)
      expect(page).to have_content(I18n.t("ss.basic_info"))
    end

    it "#copy" do
      item1
      visit gws_monitor_admins_path(site)
      click_on item1.name

      click_on I18n.t("ss.links.copy")
      within "form#item-form" do
        fill_in "item[name]", with: "copy_sample"
        click_on I18n.t("ss.buttons.save")
      end
      expect(page).to have_css('#notice', text: I18n.t('ss.notice.saved'))
      
      expect(current_path).not_to eq copy_gws_monitor_admin_path(item1.id,site)
      expect(page).to have_content("copy_sample")

      expect(Gws::Monitor::Topic.all.count).to eq 2
      source_file = Gws::Monitor::Topic.all.find_by(id: 2)
      expect(source_file.name).to eq "copy_sample"
    end
  end
end
